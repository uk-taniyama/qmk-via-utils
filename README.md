# qmk-via-utils

A utility for QMK/VIA keyboard definition and save files.

## Installation

```bash
npm install qmk-via-utils
```

## Usage

### Library

Please refer to the [documentation](./docs) for library usage details.

### CLI

```bash
npx qmk-via-utils
```

### help

```help
Usage: qmk-via-utils [options] [command]

A utility for QMK/VIA keyboard definition and save files.

Options:
  -V, --version                                                output the version number
  -h, --help                                                   display help for command

Commands:
  generate-docs <outputDir> <defPath> <savePath> [optionKeys]  Generate Markdown documentation for a keyboard
  help [command]                                               display help for command
```

#### generate-docs

- Generate Markdown documentation including:
  - Keyboard metadata
  - Custom keycodes
  - Macros
  - Layer keymaps
- Generate SVG images for each layer
- Support for VIA V3 definitions

```bash
npx qmk-via-utils generate-docs <outputDir> <defPath> <savePath>
```

- `outputDir`: Directory to output the generated files (e.g., `./docs`)
- `defPath`: Path to the VIA definition file (`.json`)
- `savePath`: Path to the VIA save file (`.json`)

Example:

```bash
npx qmk-via-utils generate-docs ./output ./keyboard-via.json ./save-via.json
```

## Credits

This project incorporates source code from [@the-via/app](https://github.com/the-via/app).

## License

GPL-3.0
