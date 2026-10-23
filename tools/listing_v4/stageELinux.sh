#!/bin/bash
# Linux (cloud) version of stage E: 4:5 hover video recorded from the LOCAL production build's /start/demo/<theme>
# (rec.mjs slow motion → full45.py 60 fps, system ffmpeg). Writes videoNN_45.mp4 here; copy it to the listing after review.
# usage: DM_ROOT=/path/to/repo ./stageELinux.sh NN [NN ...]
cd "$(dirname "$0")"
export DM_ROOT="${DM_ROOT:-$(cd ../.. && pwd)}" PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}"
export PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK=1
mkdir -p logs
for nn in "$@"; do
  th=$(awk -v n=$nn '$1==n{print $2}' themes.txt)
  rm -f infoS$nn.json
  node serve.ts $th infoS$nn.json < /dev/null > logs/E_serve_$nn.log 2>&1 &
  spid=$!
  for i in $(seq 1 90); do [ -f infoS$nn.json ] && break; sleep 2; done
  if [ ! -f infoS$nn.json ]; then echo "E $nn serve-failed"; kill $spid; continue; fi
  B=$(python3 -c "import json;print(json.load(open('infoS$nn.json'))['base'])")
  echo "{\"base\":\"$B/start/demo\",\"slug\":\"$th\",\"key\":\"\"}" > infoE$nn.json
  node rec.mjs infoE$nn.json opening rec${nn}_open45 50 2.5 432 540 < /dev/null > logs/E_rec_$nn.log 2>&1; r=$?
  kill -TERM $spid 2>/dev/null; wait $spid 2>/dev/null
  rm -rf "$(python3 -c "import json;print(json.load(open('infoS$nn.json')).get('dataDir',''))")"
  end=$(python3 -c "import json;print(round(json.load(open('rec${nn}_open45/frames.json'))['frames'][-1]['t']-0.05,2))" 2>/dev/null < /dev/null)
  python3 -X utf8 full45.py rec${nn}_open45 video${nn}_45.mp4 0.0 $end 60 0.4 < /dev/null > logs/E_mp4_$nn.log 2>&1; m=$?
  echo "E $nn $th rec=$r mp4=$m $(grep -o 'frames [0-9]*.*' logs/E_rec_$nn.log | head -1) | $(tail -1 logs/E_mp4_$nn.log)"
  [ $m -eq 0 ] && rm -rf rec${nn}_open45
done
echo E-done
