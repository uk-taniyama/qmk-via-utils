import { defineConfig } from "tsup";

export default defineConfig([{
  entry: ["src/lib/index.ts", "src/cli.ts"],
  format: ["esm", "cjs"],
  banner: {
    js: "#!/usr/bin/env node",
  },
  dts: 'src/lib/index.ts',
  clean: true,
  shims: true,
}]);
