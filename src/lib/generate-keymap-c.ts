import { loadQMKKeyboard, type QMKKeyboard } from "./qmk-utils";
import {
  getCode,
  loadVIADefinition,
  loadVIASaveFile,
  type VIADefinitionV3,
} from "./via-utils";
import { generateFile } from "./utils";

/**
 * Display width for a single keycode when printing rows.
 * This is used to align columns visually.
 */
const KEYCODE_WIDTH = 10;

/**
 * Resolve a keycode from VIA layer data and convert it into
 * a QMK-friendly representation for keymap.c output.
 */
function resolveCode(
  layer: string[],
  row: number,
  col: number,
  def: VIADefinitionV3,
): string {
  const code = getCode(layer, { row, col }, def);

  // No key assigned
  if (code == null || code === "KC_NO") {
    return "XXXXXXX";
  }

  // Transparent key
  if (code === "KC_TRNS") {
    return "_______";
  }

  return code;
}

export type KeyLayoutEntry = NonNullable<
  NonNullable<QMKKeyboard["layouts"]>[string]["layout"]
>[number];

/**
 * Convert a VIA layer into formatted rows of QMK keycodes.
 */
export function printLayerKeys(
  layer: string[],
  def: VIADefinitionV3,
  layoutData: KeyLayoutEntry[],
): string[] {
  const rows: string[] = [];

  let currentRow = "";
  let x = 0;
  let y = 0;

  for (const entry of layoutData) {
    if (entry.matrix == null) {
      throw new Error(
        `Layout entry is missing matrix information: ${JSON.stringify(entry)}`,
      );
    }

    // Detect row change:
    // - X position goes backwards
    // - Y position changes significantly
    if (entry.x < x || Math.abs(entry.y - y) > 0.8) {
      if (currentRow) {
        rows.push(currentRow);
        currentRow = "";
      }
      y = entry.y;
    }

    // Pad spaces based on X position to align columns
    x = entry.x;
    currentRow = currentRow.padEnd(x * KEYCODE_WIDTH, " ");

    const [rowIndex, colIndex] = entry.matrix;
    const code = resolveCode(layer, rowIndex, colIndex, def);

    currentRow += code;
    currentRow += ",";
  }

  if (currentRow) {
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Generate a QMK keymap.c file from VIA definition and save data.
 */
export function generateKeymapC(
  outputDir: string,
  infoPath: string,
  defPath: string,
  savePath: string,
  layoutName?: string,
): void {
  const keyboard = loadQMKKeyboard(infoPath);
  const def = loadVIADefinition(defPath);
  const saveFile = loadVIASaveFile(savePath);

  const layouts = keyboard.layouts ?? {};
  const targetLayoutName = layoutName ?? Object.keys(layouts)[0];

  if (!targetLayoutName || !layouts[targetLayoutName]) {
    throw new Error(`Layout ${targetLayoutName} not found in info.json`);
  }

  const layoutData = layouts[targetLayoutName]?.layout;
  if (!layoutData) {
    throw new Error(`Layout ${targetLayoutName} not found in layouts`);
  }

  const lines: string[] = [];

  lines.push(`#include QMK_KEYBOARD_H`);
  lines.push(``);
  lines.push(`// clang-format off`);
  lines.push(`const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {`);

  saveFile.layers.forEach((layer, layerIndex) => {
    lines.push(`\t[${layerIndex}] = ${targetLayoutName}(`);

    const rows = printLayerKeys(layer, def, layoutData);
    for (let i = 0; i < rows.length; i += 1) {
      const line = `\t\t${rows[i]}`;
      if (i !== rows.length - 1) {
        lines.push(line);
      } else {
        // Remove trailing comma from the last row
        lines.push(line.substring(0, line.length - 1));
      }
    }

    lines.push(`\t),`);
  });

  lines.push(`};`);
  lines.push(`// clang-format on`);

  // Replace all tabs with spaces for consistent formatting
  const text = lines.map((line) => line.replace(/\t/g, "    ")).join("\n");

  generateFile(outputDir, "keymap.c", text);
}
