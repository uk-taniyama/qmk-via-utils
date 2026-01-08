import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { loadJson5 } from "./utils";
import { parse } from "shell-quote";
import uniq from "lodash.uniq";

function cleanPathSegments(path: string): string {
  return path
    .split("/")
    .filter((n, i) => n !== "." && (n !== "" || i === 0))
    .filter((n, i) => {
      // Remove current-directory segments
      if (n === ".") {
        return false;
      }
      // Remove empty path segments, except the leading one for absolute paths ("/foo")
      if (n === "") {
        return i === 0;
      }
      return true;
    })
    .join("/");
}

function findPathInWorkspace(
  path: string,
  workspaceDir: string,
  searchDirs: string[],
) {
  for (const searchDir of searchDirs) {
    const fullPath = `${workspaceDir}/${searchDir}/${path}`;
    if (existsSync(fullPath)) {
      return `\${workspaceFolder}/${cleanPathSegments(`${searchDir}/${path}`)}`;
    }
  }
  return undefined;
}

function findPathSetInWorkspace(
  pathSet: Iterable<string>,
  workspaceDir: string,
  searchDirs: string[],
) {
  const result: string[] = [];
  for (const path of pathSet) {
    const foundPath = findPathInWorkspace(path, workspaceDir, searchDirs);
    if (!foundPath) {
      console.warn(`Not found: ${path}`);
      continue;
    }
    result.push(foundPath);
  }
  return uniq(result);
}

const defaultJson = {
  version: 4,
  configurations: [
    {
      name: "Linux",
      compilerPath: "/usr/bin/gcc",
      cStandard: "c17",
      cppStandard: "gnu++17",
      intelliSenseMode: "linux-gcc-x64",
    },
  ],
};

export interface ParsedCCppConfig {
  includePath: string[];
  forcedInclude: string[];
  defines: string[];
}

function updateCCppPropertiesJson(
  workspaceDir: string,
  config: ParsedCCppConfig,
) {
  const jsonPath = `${workspaceDir}/.vscode/c_cpp_properties.json`;

  const originalJson: Partial<typeof defaultJson> = {};
  if (existsSync(jsonPath)) {
    const loadedJson = loadJson5(jsonPath);
    Object.assign(originalJson, loadedJson);
  } else {
    Object.assign(originalJson, defaultJson);
  }

  if (originalJson.version == null) {
    originalJson.version = defaultJson.version;
  }
  if (originalJson.version !== defaultJson.version) {
    throw new Error(
      `Unsupported c_cpp_properties.json version: ${originalJson.version}`,
    );
  }

  if (!Array.isArray(originalJson.configurations)) {
    originalJson.configurations = [];
  }
  if (originalJson.configurations.length === 0) {
    originalJson.configurations.push({ ...defaultJson.configurations[0] });
  }

  Object.assign(originalJson.configurations[0], config);
  writeFileSync(jsonPath, JSON.stringify(originalJson, null, 4), "utf-8");
}

function loadCFlags(inputPath: string) {
  const cflags = readFileSync(inputPath, "utf-8").trim();
  // NOTE parseの返り値の型はParseEntryであるが、cflags.txtの解析であるため、すべて文字列にして処理する。
  return parse(cflags).map((n) => n.toString());
}

export function updateCCppPropertiesFromCFlags(
  workspaceDir: string,
  searchDirs: string[],
  cflagsPath: string,
) {
  const cflags = loadCFlags(cflagsPath);

  const includes: string[] = [];
  const forcedIncludes: string[] = [];
  const defines = new Set<string>();

  searchDirs.forEach((searchDir) => {
    includes.push(searchDir);
  });

  for (let i = 0; i < cflags.length; i += 1) {
    const cflag = cflags[i];
    if (cflag.startsWith("-I")) {
      includes.push(cleanPathSegments(cflag.substring(2)));
    } else if (cflag.startsWith("-D")) {
      defines.add(cflag.substring(2));
    } else if (cflag === "-include") {
      i += 1;
      if (i < cflags.length) {
        forcedIncludes.push(cleanPathSegments(cflags[i]));
      }
    }
  }

  const config: ParsedCCppConfig = {
    includePath: findPathSetInWorkspace(includes, workspaceDir, searchDirs),
    forcedInclude: findPathSetInWorkspace(
      forcedIncludes,
      workspaceDir,
      searchDirs,
    ),
    defines: Array.from(defines).sort(),
  };
  updateCCppPropertiesJson(workspaceDir, config);
}

export function listCFlagsPaths(workspace: string, searchDirs: string[]) {
  const cflagsPaths = new Set<string>();
  searchDirs.forEach((searchDir) => {
    const buildDir = `${workspace}/${searchDir}/.build`;
    if (!existsSync(buildDir)) {
      return;
    }
    const entries = readdirSync(buildDir, { withFileTypes: true });
    entries
      .filter((entry) => entry.isDirectory() && entry.name.startsWith("obj_"))
      .map((entry) => `${buildDir}/${entry.name}/cflags.txt`)
      .filter((cflagsPath) => existsSync(cflagsPath))
      .sort()
      .forEach((cflagsPath) => {
        cflagsPaths.add(cleanPathSegments(cflagsPath));
      });
  });
  Array.from(cflagsPaths)
    .sort()
    .forEach((cflagsPath) => {
      console.log(cflagsPath);
    });
}
