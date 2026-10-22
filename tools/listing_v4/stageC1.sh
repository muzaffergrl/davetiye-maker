#!/bin/bash
# C: per theme — local seeded server, tablet/laptop screens, printable invitation (PDF → PNG)
cd "$(dirname "$0")"
export PLAYWRIGHT_BROWSERS_PATH='C:\Users\Foto\AppData\Local\ms-playwright'
for nn in "$@"; do th=$(awk -v n=$nn '$1==n{print $2}' themes.txt)
  rm -f info$nn.json
  node serve.ts $th info$nn.json < /dev/null > logs/C_serve_$nn.log 2>&1 &
  spid=$!
  for i in $(seq 1 120); do [ -f info$nn.json ] && break; sleep 3; done
  if [ ! -f info$nn.json ]; then echo "C $nn serve-failed"; kill $spid; continue; fi
  node devices.mjs info$nn.json dev$nn > logs/C_dev_$nn.log 2>&1; d=$?
  B=$(python -c "import json;print(json.load(open('info$nn.json'))['base'])"); S=$(python -c "import json;print(json.load(open('info$nn.json'))['slug'])"); K=$(python -c "import json;print(json.load(open('info$nn.json'))['key'])")
  code=$(curl -s -o inv$nn.pdf -w "%{http_code}" -X POST "$B/api/edit/$S/download" -H "Authorization: Bearer $K" -H "Content-Type: application/json" -d '{"kind":"invitation","size":"5x7","bleed":false,"marks":false,"back":false}' --max-time 150)
  python -X utf8 -c "import pymupdf; d=pymupdf.open('inv$nn.pdf'); d[0].get_pixmap(dpi=300).save('inv${nn}_front.png')" 2>/dev/null; p=$?
  # stop the server tree (serve.ts + next start)
  port=$(python -c "import json;print(json.load(open('info$nn.json'))['base'].rsplit(':',1)[1])")
  pid=$(netstat -ano | grep "127.0.0.1:$port .*LISTENING" | awk '{print $5}' | head -1)
  [ -n "$pid" ] && taskkill //F //T //PID $pid > /dev/null 2>&1
  taskkill //F //T //PID $(ps -p $spid -o winpid= 2>/dev/null | tr -d ' ') > /dev/null 2>&1; kill $spid 2>/dev/null
  echo "C $nn devices=$d print=$code png=$p slug=$S"
done
