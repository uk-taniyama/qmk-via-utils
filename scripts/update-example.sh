cd $(git rev-parse --show-toplevel)

rm -rf example/output*

npx tsx src/cli.ts gen-layout example/output example/keyboard-via.json example/save-via.json
npx tsx src/cli.ts gen-layout example/outputDefault example/keyboard-via.json example/save-via.json Default
npx tsx src/cli.ts gen-layout example/output0000 example/keyboard-via.json example/save-via.json 0,0,0,0

diff -r example/output example/outputDefault || true
diff -r example/output example/output0000 || true

npx tsx src/cli.ts export-config > example/config.json
npx tsx src/cli.ts gen-keyboard -C example/config.json example/layouts example/keyboard.json
npx tsx src/cli.ts gen-keyboard -C example/config.json --led-by-key example/layouts2 example/keyboard.json
