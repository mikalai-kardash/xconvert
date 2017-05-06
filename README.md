# xconvert

A simple converter of XML data into JSON format. It has built-in rules, but all in all it is very simple.

# TODO

Several things left to accomplish before it can be used.

## Publishing

1. create project description
2. configure npm scripts
3. set keywords
4. set license
5. set main

## Build Process (Gulp)

1. version bump
2. prod vs dev (yargs based?)
3. optimize build
   - parser changed > run tests for parser only
   - particular test changes > recompile it and run this test only
4. add custom logging for watching and vscode integration
5. memory file cache to speed up process of rebuilding things
6. split compilation, style check and tests into steps
   - move configs
7. implement build and gulp in ts

## Implementation

1. Visitor - Rework to be same style, simplicity.
2. tsconfig.json for each part
   - build
   - tests
   - sources
3. readme
   - description
   - examples
4. choose typings vs @types

## vscode integration

1. problem matchers
