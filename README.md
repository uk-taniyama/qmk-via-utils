# qmk-via-utils

CLI utilities for QMK and VIA.

This project provides both a reusable library and a command-line interface
for generating documentation and visual layouts from QMK and VIA files.

---

## Installation

```bash
npm install qmk-via-utils
```

You can also use it directly via `npx` without installing.

---

## Usage

### Library

Please refer to the [documentation](./docs) for details on using the library APIs.

---

### CLI

```help
npx qmk-via-utils [options] [command]

CLI utilities for QMK and VIA

Options:
  -V, --version                                                       output the version number
  -h, --help                                                          display help for command

Commands:
  gen-layout [options] <outputDir> <defPath> <savePath> [optionKeys]  Generate Markdown documentation for a keyboard layout from VIA files
  gen-keyboard [options] <outputDir> <infoPath> [layoutName]          Generate an SVG layout for a keyboard
  export-config                                                       Print the resolved configuration as JSON
  help [command]                                                      display help for command
```

---

#### `gen-layout`

Generate Markdown documentation for a keyboard layout from VIA files.

This command can generate documentation including:

- Keyboard metadata
- Custom keycodes
- Macros
- Layer keymaps
- SVG images for each layer

It supports VIA V3 definition files.

```help gen-layout
npx qmk-via-utils gen-layout [options] <outputDir> <defPath> <savePath> [optionKeys]

Generate Markdown documentation for a keyboard layout from VIA files

Arguments:
  outputDir            Output directory for generated files
  defPath              Path to the VIA definition file (.json)
  savePath             Path to the VIA save file (.json)
  optionKeys           Comma-separated list of option keys or a preset name

Options:
  -C, --config <path>  Path to a config file
  -h, --help           display help for command
```

#### `gen-keyboard`

Generate an SVG layout for a keyboard using a QMK `info.json` file.

```help gen-keyboard
npx qmk-via-utils gen-keyboard [options] <outputDir> <infoPath> [layoutName]

Generate an SVG layout for a keyboard

Arguments:
  outputDir            Output directory for generated files
  infoPath             Path to the QMK info.json file
  layoutName           Name of the layout to render (optional)

Options:
  -C, --config <path>  Path to a config file
  --led-by-key         Resolve LED position based on key matrix
  -h, --help           display help for command
```

---

### `export-config`

Print the resolved configuration as JSON.

The exported configuration can be saved to a file, modified as needed,
and then reused with other commands via the `--config` option.

This allows you to customize settings once and apply them consistently
across multiple commands.

```bash
npx qmk-via-utils export-config > config.json
```

---

## Credits

This project incorporates source code from  
[@the-via/app](https://github.com/the-via/app).

---

## License

GPL-3.0
