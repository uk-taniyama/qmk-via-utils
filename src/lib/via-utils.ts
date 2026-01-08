import {
  isKeyboardDefinitionV3,
  isVIADefinitionV3,
  keyboardDefinitionV3ToVIADefinitionV3,
} from "@the-via/reader";
import type { VIADefinitionV3, VIAKey } from "@the-via/reader";
import { readFileSync } from "node:fs";
import { getByteForCode, getByteToKey } from "../../via-utils/key";
import basicKeyToByte from "../../via-utils/key-to-byte/default";
import { getLabel } from "../../via-utils/keyboard-rendering";

export type { VIADefinitionV3, VIAKey };

export type VIASaveFile = {
  name: string;
  vendorProductId: number;
  layers: string[][];
  macros?: string[];
  encoders?: [string, string][][];
};

export const isVIASaveFile = (obj: unknown): obj is VIASaveFile => {
  if (typeof obj !== "object" || obj === null) return false;
  const v = obj as Partial<VIASaveFile>;
  return !!(v.name && v.layers && v.vendorProductId);
};

export function loadVIADefinition(path: string) {
  const json = JSON.parse(readFileSync(path, "utf-8"));
  if (isVIADefinitionV3(json)) {
    return json;
  }
  if (isKeyboardDefinitionV3(json)) {
    return keyboardDefinitionV3ToVIADefinitionV3(json);
  }
  throw new Error(`Unsupported definition format: ${path}`);
}

export function loadVIASaveFile(path: string) {
  const json = JSON.parse(readFileSync(path, "utf-8"));
  if (isVIASaveFile(json)) {
    return json;
  }
  throw new Error(`Unsupported save file format: ${path}`);
}

export function getOptionKeys(
  via: VIADefinitionV3,
  index: number,
  value: number,
) {
  const key = via.layouts.optionKeys[index]?.[value];
  if (key == null) {
    console.warn(`No option keys for index ${index} and value ${value}`);
    return [];
  }
  return key;
}

export function collectOptionKeys(via: VIADefinitionV3, values: number[]) {
  return values.flatMap((value, index) => getOptionKeys(via, index, value));
}

export function getOptionKeysLabel(
  def: VIADefinitionV3,
  index: number,
  value: number,
): [string, string] {
  const labels = def.layouts.labels?.[index];
  if (labels == null) {
    console.warn(`No option keys label for index ${index} and value ${value}`);
    return [index.toString(), value.toString()];
  }

  // 配列でない場合は、文字列なので、boolとして返す。
  if (!Array.isArray(labels)) {
    return [labels, (value !== 0).toString()];
  }

  // 配列サイズを確認して、変換。
  if (1 + value < labels.length) {
    return [labels[0], labels[1 + value]];
  }

  console.warn(`No option keys label for index ${index} and value ${value}`);
  return [labels[0] || "0", value.toString()];
}

export function getPresetValues(def: VIADefinitionV3, preset: string) {
  return def.layouts.presets?.[preset];
}

export function toOptionKeysValues(
  via: VIADefinitionV3,
  presetOrValues?: string,
): number[] {
  // 指定なしの場合は、presets[0]を選ぶ
  if (presetOrValues === undefined) {
    if (via.layouts.presets) {
      return Object.values(via.layouts.presets)[0];
    }
    return [];
  }

  // いったん、presetsを探す
  const presetValues = getPresetValues(via, presetOrValues);
  if (presetValues) {
    return presetValues;
  }

  // ない場合は、「,」区切りで分割。
  return presetOrValues.split(",").map((value) => parseInt(value, 10));
}

export function getOptionKeysLabels(
  def: VIADefinitionV3,
  presetOrValues: string,
): [string, string][] {
  if (getPresetValues(def, presetOrValues)) {
    return [["Preset", presetOrValues]];
  }
  const values = toOptionKeysValues(def, presetOrValues);
  return values.map((value, index) => getOptionKeysLabel(def, index, value));
}

export function collectKeys(via: VIADefinitionV3, presetOrValues?: string) {
  const values = toOptionKeysValues(via, presetOrValues);
  if (values.length === 0) {
    return via.layouts.keys;
  }
  return [...via.layouts.keys, ...collectOptionKeys(via, values)];
}

const byteToKey = getByteToKey(basicKeyToByte);

// export type KeyLabel = ReturnType<typeof getLabel>;

export type KeyLabel = {
  key: string;
  label?: string;
  topLabel?: string;
  bottomLabel?: string;
  tooltip?: string;
};

export function getLabelForCode(
  code: string,
  macros: string[],
  def: VIADefinitionV3,
) {
  const byte = getByteForCode(code, basicKeyToByte);
  const label = getLabel(byte, 1, macros, def, basicKeyToByte, byteToKey);
  if (label === "") {
    return undefined;
  }
  return label as KeyLabel;
}

export function getLabelTextForCode(
  code: string,
  macros: string[],
  def: VIADefinitionV3,
) {
  const label = getLabelForCode(code, macros, def);
  if (label == null) {
    return code;
  }
  const labelText = label.label || label.key;
  const m = labelText.match(/^([A-Z]+)\((KC_.+)\)$/);
  if (!m) {
    return labelText;
  }
  const contentLabel = getLabelForCode(m[2], macros, def);
  if (contentLabel == null) {
    return labelText;
  }
  const contentText = contentLabel.label || contentLabel.key;
  return `${m[1]}(${contentText})`;
}

export function getCode(
  layer: string[],
  key: VIAKey,
  def: VIADefinitionV3,
): string | undefined {
  const cols = def.matrix.cols;
  const index = key.row * cols + key.col;
  const code = layer[index];
  return code;
}

export interface KeyInfo {
  key: VIAKey;
  code: string;
  label?: KeyLabel;
}

export function convertKey(
  key: VIAKey,
  layer: string[],
  def: VIADefinitionV3,
  macros: string[],
) {
  const code = getCode(layer, key, def) || "KC_NO";
  const label = getLabelForCode(code, macros, def);
  const keyInfo: KeyInfo = { key, code, label };
  return keyInfo;
}

export interface EncoderKeyInfo {
  code: string;
  label?: KeyLabel;
}

export function collectEncoders(saveFile: VIASaveFile, layerIndex: number) {
  return saveFile.encoders?.map(
    (encoder) => encoder[layerIndex] as [string, string],
  );
}

export function convertEncoderCodes(
  codes: [string, string],
  def: VIADefinitionV3,
  macros: string[],
) {
  return codes.map((code) => {
    const label = getLabelForCode(code, macros, def);
    return { code, label };
  }) as [EncoderKeyInfo, EncoderKeyInfo];
}
