"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cleaner_1 = require("./process/clean/cleaner");
var converter_1 = require("./process/convert/converter");
var parser_1 = require("./process/parse/parser");
var stringifier_1 = require("./process/stringify/stringifier");
function convert(content) {
    var xmlDoc = parser_1.parse(content);
    var cleanXmlDoc = cleaner_1.clean(xmlDoc);
    var jsDoc = converter_1.convert(cleanXmlDoc);
    var str = stringifier_1.stringify(jsDoc);
    return str;
}
exports.convert = convert;

//# sourceMappingURL=lib/index.js.map
