cd $(git rev-parse --show-toplevel)

git submodule update --init --remote via-app
rm -rf via-utils
mkdir -p via-utils
cp -r via-app/src/utils/* via-utils/
