import { readFileSync, writeFileSync } from "node:fs";
import { compile } from "json-schema-to-typescript";
import json5 from "json5";
import { stringify } from "../lib/utils";

function replaceRefs(obj: unknown, replacer: (value: string) => string): void {
  if (obj == null) {
    return;
  }
  if (typeof obj !== "object") {
    return;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      replaceRefs(item, replacer);
    });
    return;
  }

  const record = obj as Record<string, unknown>;
  if (typeof record.$ref === "string") {
    record.$ref = replacer(record.$ref);
    const comment = record.$comment;
    if (comment != null) {
      delete record.$comment;
    }

    const keys = Object.keys(record);
    if (keys.length > 1) {
      const { $ref, ...rest } = record;
      if (comment) {
        rest.$comment = comment;
      }
      // clear all members
      keys.forEach((key) => {
        delete record[key];
      });
      // convert to allOf
      record.allOf = [{ $ref }, { type: "object", ...rest }];
    } else {
      if (comment) {
        record["#comment"] = comment;
      }
    }
  }

  Object.keys(record).forEach((key) => {
    replaceRefs(record[key], replacer);
  });
}

function loadJsonScheme(path: string) {
  const text = readFileSync(path, "utf-8");
  return json5.parse(text);
}

async function main() {
  const [, , schemeDir] = process.argv;
  const keyboard = loadJsonScheme(`${schemeDir}/keyboard.jsonschema`);
  const definitions = loadJsonScheme(`${schemeDir}/definitions.jsonschema`);

  //
  delete keyboard.$schema;
  keyboard.title = "QMK Keyboard";
  replaceRefs(keyboard, (value) =>
    value.replace("./definitions.jsonschema#/", "#/definitions/"),
  );
  delete definitions.$schema;
  delete definitions.$id;
  delete definitions.title;
  delete definitions.type;
  replaceRefs(definitions, (value) => value.replace("#/", "#/definitions/"));

  keyboard.definitions = {
    ...(keyboard.definitions ?? {}),
    ...(definitions.definitions ?? definitions),
  };

  const ts = await compile(keyboard, "keyboard", {
    bannerComment: "/* biome-ignore-all */",
  });

  writeFileSync(`${schemeDir}/index.json`, stringify(keyboard));
  writeFileSync(`${schemeDir}/index.ts`, ts);
}

main();
