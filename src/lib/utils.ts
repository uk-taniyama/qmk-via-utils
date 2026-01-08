import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import prettyCompact from "json-stringify-pretty-compact";
import json5 from "json5";

export const stringify = (obj: unknown, maxLength: number = 200) =>
  prettyCompact(obj, { indent: 2, maxLength });

export function loadJson5(path: string) {
  const text = readFileSync(path, "utf-8");
  return json5.parse(text);
}

export function generateFile(
  outputDir: string,
  fileName: string,
  content: string,
) {
  const outputPath = `${outputDir}/${fileName}`;
  mkdirSync(outputDir, { recursive: true });
  console.log(`Generated ${outputPath}.`);
  writeFileSync(outputPath, content);
}

export function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
