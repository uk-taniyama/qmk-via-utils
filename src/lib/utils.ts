import { mkdirSync, writeFileSync } from "node:fs";
import prettyCompact from "json-stringify-pretty-compact";

export const stringify = (obj: unknown) =>
  prettyCompact(obj, { indent: 2, maxLength: 200 });

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
