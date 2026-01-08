import { Command } from "commander";
import { readPackageSync } from "read-pkg";
import { generateKeyLayouts, generateKeyboardSvg } from "./lib/index";
import { config, initConfig } from "./lib/config";

const pkg = readPackageSync();

const program = new Command();

if (process.env.HELP_WIDTH != null) {
  program.configureHelp({ helpWidth: Number(process.env.HELP_WIDTH) });
}

program
  .name(pkg.name)
  .description(pkg.description || "CLI utilities for QMK and VIA")
  .version(pkg.version);

type Options = {
  config?: string;
};

function applyOptions(options?: Options) {
  if (options == null) {
    return;
  }
  if (options.config) {
    initConfig(options.config);
  }
}

function run(options: Options | undefined, action: () => void) {
  try {
    applyOptions(options);
    action();
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

program
  .command("gen-layout")
  .description(
    "Generate Markdown documentation for a keyboard layout from VIA files",
  )
  .option("-C, --config <path>", "Path to a config file")
  .argument("<outputDir>", "Output directory for generated files")
  .argument("<defPath>", "Path to the VIA definition file (.json)")
  .argument("<savePath>", "Path to the VIA save file (.json)")
  .argument(
    "[optionKeys]",
    "Comma-separated list of option keys or a preset name",
  )
  .action(
    (
      outputDir: string,
      defPath: string,
      savePath: string,
      presetOrValues?: string,
      options?: Options,
    ) => {
      run(options, () => {
        generateKeyLayouts(outputDir, defPath, savePath, presetOrValues);
      });
    },
  );

export interface GenKeyboardOptions extends Options {
  ledByKey?: boolean;
}

program
  .command("gen-keyboard")
  .description("Generate an SVG layout for a keyboard")
  .option("-C, --config <path>", "Path to a config file")
  .option("--led-by-key", "Resolve LED position based on key matrix")
  .argument("<outputDir>", "Output directory for generated files")
  .argument("<infoPath>", "Path to the QMK info.json file")
  .argument("[layoutName]", "Name of the layout to render (optional)")
  .action(
    (
      outputDir: string,
      infoPath: string,
      layoutName?: string,
      options?: GenKeyboardOptions,
    ) => {
      run(options, () =>
        generateKeyboardSvg(outputDir, infoPath, layoutName, options?.ledByKey),
      );
    },
  );

program
  .command("export-config")
  .description("Print the resolved configuration as JSON")
  .action(() => console.log(JSON.stringify(config, null, 2)));

program.parse(process.argv);
