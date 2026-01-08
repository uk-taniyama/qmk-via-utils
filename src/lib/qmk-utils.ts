import { readFileSync } from "node:fs";
import Ajv from "ajv";
import schema from "./qmk-schemes/index.json" with { type: "json" };
import type { QMKKeyboard } from "./qmk-schemes/index";

export * from "./qmk-schemes/index";

const ajv = new Ajv();
const validate = ajv.compile(schema);

export function loadQMKKeyboard(path: string) {
  const json = JSON.parse(readFileSync(path, "utf-8"));
  if (validate(json)) {
    return json as QMKKeyboard;
  }
  throw new Error(
    `Unsupported definition format: ${path} : ${ajv.errorsText(validate.errors)}`,
  );
}
