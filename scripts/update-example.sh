cd $(git rev-parse --show-toplevel)

rm -rf example/output*
npx tsx src/cli.ts generate-docs example/output example/keyboard-via.json example/save-via.json
npx tsx src/cli.ts generate-docs example/outputDefault example/keyboard-via.json example/save-via.json Default
npx tsx src/cli.ts generate-docs example/output0000 example/keyboard-via.json example/save-via.json 0,0,0,0

diff -r example/output example/outputDefault || true
diff -r example/output example/output0000 || true
