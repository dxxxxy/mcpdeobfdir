# mcpdeobfdir
Deobfuscates a whole directory of Java source files from `searge` to `mcp` mappings. Ideal to use after disassembling/decompiling a `.jar` file with something like [Procyon](https://github.com/mstrobel/Procyon). Supports Minecraft 1.8 to 1.12 mappings. Uses a single-dependency: [csv-parser](https://github.com/mafintosh/csv-parser).

## Install
```
npm i mcpdd -g 
```

## Usage
```powershell
# Syntax
mcpdd --dir=<path> --version=<version>

# Example
mcpdd --dir=C:\Users\DXXXXY\Downloads\decomp --version=1.8
```