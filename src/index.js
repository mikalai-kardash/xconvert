"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var converter_1 = require("./converter");
var stringifier_1 = require("./stringifier");
var cleaner_1 = require("./cleaner");
function convert(xmlContent) {
    var c = new converter_1.Converter();
    var xml = parser_1.parse(xmlContent);
    var betterXml = cleaner_1.clean(xml);
    var js = c.Convert(betterXml);
    var str = stringifier_1.stringify(js);
    return str;
}
exports.convert = convert;
//# sourceMappingURL=index.js.map