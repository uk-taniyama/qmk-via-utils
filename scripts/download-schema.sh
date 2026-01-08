cd $(git rev-parse --show-toplevel)

schemes_url=https://raw.githubusercontent.com/qmk/qmk_firmware/refs/heads/master/data/schemas/
schemes_dir=src/lib/qmk-schemes

download_scheme() {
  name=$1
  curl -L $schemes_url/$name -o $schemes_dir/$name
}

# rm -rf $schemes_dir
# mkdir -p $schemes_dir
# download_scheme definitions.jsonschema
# download_scheme keyboard.jsonschema

npx tsx src/scripts/generate-types.ts src/lib/qmk-schemes/
npx tsx src/lib/qmk-utils.ts example/keyboard.json 
