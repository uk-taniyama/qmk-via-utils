import { escapeHtml, generateFile } from "./utils";
import {
  collectEncoders,
  collectKeys,
  convertEncoderCodes,
  convertKey,
  getOptionKeysLabels,
  type KeyInfo,
  loadVIADefinition,
  loadVIASaveFile,
  type VIADefinitionV3,
  type VIASaveFile,
} from "./via-utils";

const keyUnit = 32;

export function generateSvgForKey(svg: string[], keyInfo: KeyInfo) {
  const { key, code, label } = keyInfo;
  const encoder = key.ei != null;
  const x = key.x * keyUnit;
  const y = key.y * keyUnit;
  const w = key.w * keyUnit;
  const h = key.h * keyUnit;
  const c = "white";
  const t = label?.label || label?.key || code;
  const topLabel = label?.topLabel;
  const bottomLabel = label?.bottomLabel;
  const tooltip = label?.tooltip;
  const rx = encoder ? w / 2 : 4;
  const ry = encoder ? h / 2 : 4;

  svg.push("<g>");
  if (tooltip) {
    svg.push(`<title>${escapeHtml(tooltip)}</title>`);
  }
  svg.push(
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ry="${ry}" fill="${c}" stroke="black" stroke-width="1" />`,
  );
  if (topLabel != null && bottomLabel != null) {
    svg.push(
      `<text x="${x + w / 2}" y="${y + h / 2 - 3}" font-size="8" text-anchor="middle" fill="black">${escapeHtml(topLabel)}</text>`,
    );
    svg.push(
      `<text x="${x + w / 2}" y="${y + h / 2 + 10}" font-size="8" text-anchor="middle" fill="black">${escapeHtml(bottomLabel)}</text>`,
    );
  } else {
    svg.push(
      `<text x="${x + w / 2}" y="${y + h / 2 + 4}" font-size="8" text-anchor="middle" fill="black">${escapeHtml(t)}</text>`,
    );
  }
  svg.push("</g>");
}

export function generateMarkdown(
  outputDir: string,
  def: VIADefinitionV3,
  saveFile: VIASaveFile,
  presetOrValues?: string,
) {
  const w = def.layouts.width;
  const h = def.layouts.height;
  const layers = saveFile.layers.length;
  const macros = saveFile.macros || [];
  const vendorProductId = def.vendorProductId
    .toString(16)
    .toUpperCase()
    .padStart(8, "0");
  const vendorId = `0x${vendorProductId.slice(0, 4)}`;
  const productId = `0x${vendorProductId.slice(4)}`;
  const md: string[] = [
    `# Keyboard`,
    "",
    "|Key|Value|",
    "|---|---|",
    `|name|${def.name}|`,
    `|vendorId|${vendorId}|`,
    `|productId|${productId}|`,
    `|layers|${layers}|`,
    "",
  ];
  if (presetOrValues) {
    md.push("## Option Keys", "", `|Key|Value|`, "|---|---|");
    getOptionKeysLabels(def, presetOrValues).forEach(([key, value]) => {
      md.push(`|${key}|${value}|`);
    });
    md.push("");
  }

  if (def.customKeycodes) {
    md.push(
      "## Custom Keycodes",
      "",
      "|Name|Title|Short Name|",
      "|---|---|---|",
    );
    def.customKeycodes.forEach((keycode) => {
      md.push(`|${keycode.name}|${keycode.title}|${keycode.shortName || "-"}|`);
    });
    md.push("");
  }

  const macroDef = macros
    .map((macro, index) => ({ macro, index }))
    .filter(({ macro }) => macro.length > 0);
  if (macroDef.length > 0) {
    md.push("## Macros", "", "|Name|Value|", "|---|---|");
    macroDef.forEach(({ index, macro }) => {
      md.push(`|${index}|${macro}|`);
    });
    md.push("");
  }

  const keys = collectKeys(def, presetOrValues);

  saveFile.layers.forEach((layer, layerIndex) => {
    const svgName = `layer${layerIndex}.svg`;

    md.push(`## Layer ${layerIndex}`, "", `![${svgName}](${svgName})`, "");

    const svg: string[] = [
      '<?xml version="1.0"?>',
      `<svg width="${(w + 1) * keyUnit}" height="${(h + 1) * keyUnit}" xmlns="http://www.w3.org/2000/svg">`,
      `<g transform="translate(${keyUnit / 2},${keyUnit / 2})">`,
    ];
    keys.forEach((key) => {
      const keyInfo = convertKey(key, layer, def, macros);
      generateSvgForKey(svg, keyInfo);
    });
    svg.push("</g></svg>");
    generateFile(outputDir, svgName, svg.join("\n"));

    const encoders = collectEncoders(saveFile, layerIndex);
    if (encoders && encoders.length > 0) {
      md.push("|Name|Left|Right|", "|---|---|---|");
      encoders.forEach((encoder, index) => {
        const line = [`|Encoder ${index}|`];
        convertEncoderCodes(encoder, def, macros).forEach(({ code, label }) => {
          line.push(`${label?.label || label?.key || code}|`);
        });
        md.push(line.join(""));
      });
      md.push("");
    }
  });

  generateFile(outputDir, "README.md", md.join("\n"));
}

export function generateKeyboardDocs(
  outputDir: string,
  defPath: string,
  savePath: string,
  presetOrValues?: string,
) {
  const def = loadVIADefinition(defPath);
  const saveFile = loadVIASaveFile(savePath);
  generateMarkdown(outputDir, def, saveFile, presetOrValues);
}
