import { calculatePointPosition } from "../../via-utils/keyboard-rendering";
import { config } from "./config";
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
  type VIAKey,
  type VIASaveFile,
} from "./via-utils";

export function generateSvgForKey(svg: string[], keyInfo: KeyInfo) {
  const { keyWidth, keyHeight, keyFill, keyStroke, keyFontSize, keyFontColor } =
    config;
  const { key, code, label } = keyInfo;
  const encoder = key.ei != null;
  const w = key.w * keyWidth;
  const h = key.h * keyHeight;
  const t = label?.label || label?.key || code;
  const topLabel = label?.topLabel;
  const bottomLabel = label?.bottomLabel;
  const tooltip = label?.tooltip;
  const rx = encoder ? w / 2 : 4;
  const ry = encoder ? h / 2 : 4;
  const [ox, oy] = calculatePointPosition(key);

  svg.push(
    `<g transform="translate(${ox} ${oy}) rotate(${key.r}) translate(${-w / 2} ${-h / 2})">`,
  );
  if (tooltip) {
    svg.push(`<title>${escapeHtml(tooltip)}</title>`);
  }
  svg.push(
    `<rect width="${w}" height="${h}" rx="${rx}" ry="${ry}" fill="${keyFill}" stroke="${keyStroke}" stroke-width="1" />`,
  );
  if (topLabel != null && bottomLabel != null) {
    svg.push(
      `<text x="${w / 2}" y="${h / 2 - keyFontSize / 2}" font-size="${keyFontSize}" text-anchor="middle" fill="${keyFontColor}">${escapeHtml(topLabel)}</text>`,
    );
    svg.push(
      `<text x="${w / 2}" y="${h / 2 + keyFontSize}" font-size="${keyFontSize}" text-anchor="middle" fill="${keyFontColor}">${escapeHtml(bottomLabel)}</text>`,
    );
  } else {
    svg.push(
      `<text x="${w / 2}" y="${h / 2 + keyFontSize / 2}" font-size="${keyFontSize}" text-anchor="middle" fill="${keyFontColor}">${escapeHtml(t)}</text>`,
    );
  }
  svg.push("</g>");
}

export function generateLayoutSvgInner(
  outputDir: string,
  svgName: string,
  layer: string[],
  keys: VIAKey[],
  def: VIADefinitionV3,
  macros: string[],
) {
  const { keyWidth, keyHeight, keySpacing } = config;
  const w = def.layouts.width;
  const h = def.layouts.height;
  const uw = keyWidth + keySpacing;
  const uh = keyHeight + keySpacing;

  const svg: string[] = [
    '<?xml version="1.0"?>',
    `<svg width="${(w + 1) * uw}" height="${(h + 1) * uh}" xmlns="http://www.w3.org/2000/svg">`,
    `<g transform="translate(${uw / 2},${uh / 2})">`,
  ];
  keys.forEach((key) => {
    const keyInfo = convertKey(key, layer, def, macros);
    generateSvgForKey(svg, keyInfo);
  });
  svg.push("</g></svg>");
  generateFile(outputDir, svgName, svg.join("\n"));
}

export function generateLayoutSvg(
  outputDir: string,
  svgName: string,
  def: VIADefinitionV3,
  saveFile: VIASaveFile,
  layerIndex: number,
  presetOrValues?: string,
) {
  const layer = saveFile.layers[layerIndex];
  const keys = collectKeys(def, presetOrValues);
  const macros = saveFile.macros || [];
  generateLayoutSvgInner(outputDir, svgName, layer, keys, def, macros);
}

export function generateMarkdown(
  outputDir: string,
  def: VIADefinitionV3,
  saveFile: VIASaveFile,
  presetOrValues?: string,
) {
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
    generateLayoutSvgInner(outputDir, svgName, layer, keys, def, macros);

    md.push(`## Layer ${layerIndex}`, "", `![${svgName}](${svgName})`, "");

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

export function generateKeyLayouts(
  outputDir: string,
  defPath: string,
  savePath: string,
  presetOrValues?: string,
) {
  const def = loadVIADefinition(defPath);
  const saveFile = loadVIASaveFile(savePath);
  generateMarkdown(outputDir, def, saveFile, presetOrValues);
}
