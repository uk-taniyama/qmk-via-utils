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

```help
npx qmk-via-utils [options] [command]

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

```help generate-docs
npx qmk-via-utils generate-docs [options] <outputDir> <defPath> <savePath> [optionKeys]

Generate Markdown documentation for a keyboard

Arguments:
  outputDir   Directory to output the generated files
  defPath     Path to the VIA definition file (.json)
  savePath    Path to the VIA save file (.json)
  optionKeys  Comma-separated list of option keys or a preset name

Options:
  -h, --help  display help for command
```

## Credits

This project incorporates source code from [@the-via/app](https://github.com/the-via/app).

## License

GPL-3.0
