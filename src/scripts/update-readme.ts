import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { generateFile } from "../lib/utils";

const readmePath = "README.md";
const backupPath = "README.md.bak";
const helpCommand = "npx tsx src/cli.ts --help";
const startMarker = "```help";
const endMarker = "```";

console.log("Generating help output...");
const help = execSync(helpCommand, { encoding: "utf-8" }).trim();

const input = readFileSync(readmePath, "utf-8");
generateFile(".", backupPath, input);

const lines = input.split("\n");

const startIndex = lines.indexOf(startMarker);
const endIndex = lines.indexOf(endMarker, startIndex + 1);
if (startIndex < 0 || endIndex < 0) {
  throw new Error(
    `Invalid readme file. (${startMarker}:${startIndex}, ${endMarker}:${endIndex}`,
  );
}
const output = [
  ...lines.slice(0, startIndex + 1),
  help,
  ...lines.slice(endIndex),
].join("\n");
generateFile(".", readmePath, output);
