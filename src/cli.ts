import { Command } from "commander";
import { readPackageSync } from "read-pkg";
import { generateKeyboardDocs } from "./lib/index";

const pkg = readPackageSync();

const program = new Command();

program
  .name(pkg.name)
  .description(pkg.description || "CLI for QMK/VIA utilities")
  .version(pkg.version);

program
  .command("generate-docs")
  .description("Generate Markdown documentation for a keyboard")
  .argument("<outputDir>", "Directory to output the generated files")
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
    ) => {
      try {
        generateKeyboardDocs(outputDir, defPath, savePath, presetOrValues);
      } catch (e) {
        console.error("Failed to generate docs:", e);
        process.exit(1);
      }
    },
  );

program.parse(process.argv);
