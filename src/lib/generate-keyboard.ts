import { loadQMKKeyboard, type QMKKeyboard } from "./qmk-utils";
import { generateFile } from "./utils";
import { config } from "./config";

export type KeyLayoutEntry = NonNullable<
  NonNullable<QMKKeyboard["layouts"]>[string]["layout"]
>[number];

export type LedLayoutEntry = NonNullable<
  NonNullable<QMKKeyboard["rgb_matrix"]>["layout"]
>[number];

export type Matrix = NonNullable<KeyLayoutEntry["matrix"]>;

function renderKey(entry: KeyLayoutEntry) {
  const {
    keyWidth,
    keyHeight,
    keySpacing,
    keyFill,
    keyStroke,
    keyFontSize,
    keyFontColor,
  } = config;
  const matrix = entry.matrix;
  const x = entry.x * keyWidth + keySpacing / 2;
  const y = entry.y * keyHeight + keySpacing / 2;
  const w = (entry.w ?? 1) * keyWidth - keySpacing;
  const h = (entry.h ?? 1) * keyHeight - keySpacing;

  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" ry="6" fill="${keyFill}" stroke="${keyStroke}" stroke-width="1"/>
  <text x="${x + w / 2}" y="${y + h / 2 + 20}" font-size="${keyFontSize}" text-anchor="middle" fill="${keyFontColor}">${matrix}</text>
  `;
}

export interface LedPosition {
  x: number;
  y: number;
  ty: number;
}

export type GetLedPosition = (entry: LedLayoutEntry) => LedPosition | undefined;

export function createLedPosition(): GetLedPosition {
  const { ledOffsetX, ledOffsetY, ledScaleX, ledScaleY } = config;
  return (entry) => {
    const x = entry.x * ledScaleX + ledOffsetX;
    const y = entry.y * ledScaleY + ledOffsetY;
    const ty = y - 4;
    return { x, y, ty };
  };
}

export function createLedPositionByKey(keys: KeyLayoutEntry[]): GetLedPosition {
  const { keyWidth, keyHeight, ledSize, ledFontSize } = config;

  return (entry) => {
    const matrix = entry.matrix;
    if (!matrix) return undefined;

    const key = keys.find(
      (k) => k.matrix?.[0] === matrix[0] && k.matrix?.[1] === matrix[1],
    );
    if (!key) return undefined;

    const x = key.x * keyWidth + keyWidth / 2 - ledSize / 2;
    const ty = key.y * keyHeight + ledFontSize;
    const y = ty + 4;

    return { x, y, ty };
  };
}

export function renderLed(
  entry: LedLayoutEntry,
  index: number,
  getPosition: GetLedPosition,
) {
  const { ledSize, ledFill, ledStroke, ledFontSize, ledFontColor } = config;

  const pos = getPosition(entry);
  if (!pos) {
    return undefined;
  }

  const { x, y, ty } = pos;
  const w = ledSize;
  const h = ledSize;
  const r = ledSize / 2;
  return `
  <rect class="led ${entry.x} ${entry.y}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${ledFill}" stroke="${ledStroke}" stroke-width="1"/>
  <text x="${x + w / 2}" y="${ty}" font-size="${ledFontSize}" text-anchor="middle" fill="${ledFontColor}">${index}</text>
  `;
}

export interface LayoutItem {
  x: number;
  y: number;
  w?: number;
  h?: number;
}

export function calcBounds(items: LayoutItem[]) {
  let w = 0;
  let h = 0;

  items.forEach((item) => {
    w = Math.max(w, item.x + (item.w ?? 1));
    h = Math.max(h, item.y + (item.h ?? 1));
  });

  return { w, h };
}

function renderKeyboard(
  keyboard: QMKKeyboard,
  layoutName?: string,
  ledLayoutByKey: boolean = false,
) {
  const layouts = keyboard.layouts ?? {};
  const layout = layoutName ? layouts[layoutName] : Object.values(layouts)[0];
  const keyLayout = layout?.layout;
  if (keyLayout == null) {
    throw new Error("KeyLayout not found");
  }
  const ledLayout =
    keyboard.rgb_matrix?.layout ?? keyboard.led_matrix?.layout ?? [];

  const bounds = calcBounds(keyLayout);

  const { keyWidth, keyHeight } = config;
  const width = (bounds.w + 1) * keyWidth;
  const height = (bounds.h + 1) * keyHeight;

  const svg = [
    '<?xml version="1.0"?>',
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`,
  ];
  svg.push(`<g transform='translate(${keyWidth / 2}, ${keyHeight / 2})'>`);
  keyLayout.forEach((e) => {
    svg.push(renderKey(e));
  });
  svg.push("</g>");
  if (ledLayout.length > 0) {
    const getPosition =
      ledLayoutByKey === true
        ? createLedPositionByKey(keyLayout)
        : createLedPosition();
    svg.push(`<g transform='translate(${keyWidth / 2}, ${keyHeight / 2})'>`);
    ledLayout.forEach((e, i) => {
      const led = renderLed(e, i, getPosition);
      if (led == null) {
        console.warn(`No matching key for LED: ${JSON.stringify(e)}`);
        return;
      }
      svg.push(led);
    });
    svg.push("</g>");
  }

  svg.push("</svg>");

  return svg.join("\n");
}

export function generateKeyboardSvg(
  outputDir: string,
  path: string,
  layoutName?: string,
  ledLayoutByKey?: boolean,
) {
  const keyboard = loadQMKKeyboard(path);
  if (layoutName == null) {
    Object.keys(keyboard.layouts ?? {}).forEach((name) => {
      const svg = renderKeyboard(keyboard, name, ledLayoutByKey);
      generateFile(outputDir, `layout_${name}.svg`, svg);
    });
  } else {
    const svg = renderKeyboard(keyboard, layoutName, ledLayoutByKey);
    generateFile(outputDir, `layout_${layoutName}.svg`, svg);
  }
}
