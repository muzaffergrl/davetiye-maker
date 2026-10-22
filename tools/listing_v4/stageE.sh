#!/bin/bash
# E: 4:5 full-frame hover video per design from its live demo (slow-motion capture → 60 fps)
cd "$(dirname "$0")"
for nn in "$@"; do
  th=$(awk -v n=$nn '$1==n{print $2}' themes.txt)
  echo "{\"base\":\"https://bkestudio.com/start/demo\",\"slug\":\"$th\",\"key\":\"\"}" > infoE$nn.json
  node rec.mjs infoE$nn.json opening rec${nn}_open45 50 2.5 432 540 < /dev/null > logs/E_rec_$nn.log 2>&1; r=$?
  end=$(python -c "import json;print(round(json.load(open('rec${nn}_open45/frames.json'))['frames'][-1]['t']-0.05,2))" 2>/dev/null < /dev/null)
  python -X utf8 full45.py rec${nn}_open45 video${nn}_45.mp4 0.0 $end 60 0.4 < /dev/null > logs/E_mp4_$nn.log 2>&1; m=$?
  d=$(ls -d C:/Users/Foto/Documents/davetiye-maker/collections/${nn}_*)/package/listing; mkdir -p "$d"
  [ $m -eq 0 ] && cp video${nn}_45.mp4 "$d/video_v4_4x5.mp4" && rm -rf rec${nn}_open45
  echo "E $nn $th rec=$r mp4=$m $(grep -o 'frames [0-9]*.*' logs/E_rec_$nn.log | head -1) | $(tail -1 logs/E_mp4_$nn.log)"
done
echo E-done
