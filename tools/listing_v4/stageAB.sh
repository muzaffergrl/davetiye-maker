#!/bin/bash
# A: live-demo opening stills; B: capture.ts screens. 2 at a time.
cd "$(dirname "$0")"
export NODE_PATH="$PWD/node_modules" PLAYWRIGHT_BROWSERS_PATH="C:/Users/Foto/AppData/Local/ms-playwright"
grep -v "^01 " themes.txt | while read nn th; do echo "$nn $th"; done > todo.txt
cat todo.txt | xargs -P 2 -L 1 bash -c 'node shots.mjs $1 shots/$1 > logs/A_$0.log 2>&1; echo "A $0 $?"'
cat todo.txt | xargs -P 2 -L 1 bash -c 'cd C:/Users/Foto/Documents/davetiye-maker && node tools/listing_templates/capture.ts --theme $1 --out "'"$PWD"'/cap$0" --public-url https://bkestudio.com > "'"$PWD"'/logs/B_$0.log" 2>&1; echo "B $0 $? $(grep -c ^FAIL "'"$PWD"'/logs/B_$0.log")"'
