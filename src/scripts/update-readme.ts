import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { generateFile } from "../lib/utils";

const readmePath = "README.md";
const backupPath = "README.md.bak";

function execHelp(command: string) {
  console.log(`Generating "${command}" output...`);
  const helpCommand = `npx tsx src/cli.ts ${command}`;
  const helpOutput = execSync(helpCommand, {
    encoding: "utf-8",
    env: {
      ...process.env,
      HELP_WIDTH: "1200",
    },
  }).trim();
  return helpOutput.replace(/^Usage: /, "npx ").replace(process.cwd(), ".");
}

const input = readFileSync(readmePath, "utf-8");
generateFile(".", backupPath, input);

const lines = input.split("\n");
const output: string[] = [];

let inHelp = false;
lines.forEach((line) => {
  if (inHelp) {
    if (line === "```") {
      inHelp = false;
      output.push(line);
    }
    return;
  }
  output.push(line);
  if (line.startsWith("```help")) {
    output.push(execHelp(line.substring(3)));
    inHelp = true;
  }
});

generateFile(".", readmePath, output.join("\n"));
