#!/bin/bash
# Linux (cloud) version of stages A + B + C for the given designs, all against the LOCAL production build:
#   A  opening stills from the local /start/demo/<theme> (shots.mjs with DEMO_BASE)
#   C  seeded local site: tablet/laptop screens (devices.mjs) + printable invitation PDF → PNG (pdftoppm)
#   B  tools/listing_templates/capture.ts (guest + editor screens)
# usage: DM_ROOT=/path/to/repo ./stageLinux.sh NN [NN ...]      (needs platform/.next from `npm run build`)
cd "$(dirname "$0")"
W="$PWD"
export DM_ROOT="${DM_ROOT:-$(cd ../.. && pwd)}" PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}"
export NODE_PATH="${NODE_PATH:-/opt/node22/lib/node_modules}" PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK=1
mkdir -p logs
for nn in "$@"; do
  th=$(awk -v n=$nn '$1==n{print $2}' themes.txt)
  rm -f info$nn.json
  node serve.ts $th info$nn.json < /dev/null > logs/C_serve_$nn.log 2>&1 &
  spid=$!
  for i in $(seq 1 90); do [ -f info$nn.json ] && break; sleep 2; done
  if [ ! -f info$nn.json ]; then echo "C $nn serve-failed"; kill $spid; continue; fi
  B=$(python3 -c "import json;print(json.load(open('info$nn.json'))['base'])")
  S=$(python3 -c "import json;print(json.load(open('info$nn.json'))['slug'])")
  K=$(python3 -c "import json;print(json.load(open('info$nn.json'))['key'])")
  rm -rf shots/$th
  DEMO_BASE="$B/start/demo" node shots.mjs $th shots/$th < /dev/null > logs/A_$nn.log 2>&1; a=$?
  node devices.mjs info$nn.json dev$nn < /dev/null > logs/C_dev_$nn.log 2>&1; d=$?
  code=$(curl -s -o inv$nn.pdf -w "%{http_code}" -X POST "$B/api/edit/$S/download" -H "Authorization: Bearer $K" \
    -H "Content-Type: application/json" -d '{"kind":"invitation","size":"5x7","bleed":false,"marks":false,"back":false}' --max-time 150)
  pdftoppm -r 300 -f 1 -l 1 -singlefile -png inv$nn.pdf inv${nn}_front 2>/dev/null; p=$?
  kill -TERM $spid 2>/dev/null; wait $spid 2>/dev/null
  rm -rf "$(python3 -c "import json;print(json.load(open('info$nn.json')).get('dataDir',''))")"
  echo "A $nn open-frames=$(ls shots/$th/open_*.jpg 2>/dev/null | wc -l) rc=$a | C $nn devices=$d print=$code png=$p"
  rm -rf cap$nn
  (cd "$DM_ROOT" && node tools/listing_templates/capture.ts --theme $th --out "$W/cap$nn" --public-url https://bkestudio.com < /dev/null) > logs/B_$nn.log 2>&1
  echo "B $nn rc=$? fails=$(grep -c ^FAIL logs/B_$nn.log)"
done
echo ALC-done
