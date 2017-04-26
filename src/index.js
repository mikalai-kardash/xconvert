"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var converter_1 = require("./converter");
var stringifier_1 = require("./stringifier");
function convert(xmlContent) {
    var p = new parser_1.Parser();
    var c = new converter_1.Converter();
    var s = new stringifier_1.Stringifier();
    var xml = p.Parse(xmlContent);
    var js = c.Convert(xml);
    var str = s.Stringify(js);
    return str;
}
exports.convert = convert;
//# sourceMappingURL=index.js.map