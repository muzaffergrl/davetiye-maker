#!/bin/bash
# B (capture.ts screens, 2 at a time) then C (devices + print) for the given designs.
cd "$(dirname "$0")"
export NODE_PATH="$PWD/node_modules" PLAYWRIGHT_BROWSERS_PATH="C:/Users/Foto/AppData/Local/ms-playwright"
for nn in "$@"; do echo "$nn $(awk -v n=$nn '$1==n{print $2}' themes.txt)"; done > todoB.txt
cat todoB.txt | xargs -P 1 -L 1 bash -c 'cd C:/Users/Foto/Documents/davetiye-maker && node tools/listing_templates/capture.ts --theme $1 --out "'"$PWD"'/cap$0" --public-url https://bkestudio.com < /dev/null > "'"$PWD"'/logs/B_$0.log" 2>&1; echo "B $0 $? $(grep -c ^FAIL "'"$PWD"'/logs/B_$0.log")"'
./stageC1.sh "$@"
echo BC-done
