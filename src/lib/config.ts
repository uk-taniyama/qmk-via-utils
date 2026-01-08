import { CSSVarObject } from "../../via-utils/keyboard-rendering";
import { loadJson5 } from "./utils";

type ConfigValue = string | number | boolean;
type ConfigRecord = Record<string, ConfigValue>;

function castValue(
  value: unknown,
  target: ConfigValue,
): ConfigValue | undefined {
  if (typeof target === "string") {
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
  }

  if (typeof target === "number") {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "") {
      const n = Number(value);
      if (!Number.isNaN(n)) return n;
    }
    if (typeof value === "boolean") {
      return value ? 1 : 0;
    }
  }

  if (typeof target === "boolean") {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
      if (["true", "1", "yes", "on"].includes(value.toLowerCase())) return true;
      if (["false", "0", "no", "off"].includes(value.toLowerCase()))
        return false;
    }
  }

  return undefined;
}

export function safeMerge<T extends ConfigRecord>(defaults: T, input: unknown) {
  if (typeof input !== "object" || input === null) {
    return defaults;
  }

  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const raw = (input as Record<keyof T, unknown>)[key];
    if (raw === undefined) continue;

    const coerced = castValue(raw, defaults[key]);
    if (coerced !== undefined) {
      defaults[key] = coerced as T[keyof T];
    }
  }
}

export const config = {
  keyWidth: 52,
  keyHeight: 54,
  keySpacing: 2,
  keyFill: "#eee",
  keyStroke: "#222",
  keyFontSize: 16,
  keyFontColor: "#222",

  ledSize: 8,
  ledOffsetX: 32,
  ledOffsetY: 32,
  ledScaleX: 4,
  ledScaleY: 4,
  ledFill: "#f44",
  ledStroke: "#222",
  ledFontSize: 12,
  ledFontColor: "#444",
};

export function initConfig(path: string) {
  const json = loadJson5(path);
  safeMerge(config, json);

  // overwrite CSSVarObject
  CSSVarObject.keyWidth = config.keyWidth;
  CSSVarObject.keyXSpacing = config.keySpacing;
  CSSVarObject.keyHeight = config.keyWidth;
  CSSVarObject.keyYSpacing = config.keySpacing;
  CSSVarObject.keyXPos = config.keyWidth + config.keySpacing;
  CSSVarObject.keyYPos = config.keyHeight + config.keySpacing;
}
