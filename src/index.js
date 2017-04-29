"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var converter_1 = require("./converter");
var stringifier_1 = require("./stringifier");
var cleaner_1 = require("./cleaner");
function convert(xmlContent) {
    var p = new parser_1.Parser();
    var c = new converter_1.Converter();
    var s = new stringifier_1.Stringifier();
    var cl = new cleaner_1.Cleaner();
    var xml = p.Parse(xmlContent);
    var betterXml = cl.clean(xml);
    var js = c.Convert(betterXml);
    var str = s.Stringify(js);
    return str;
}
exports.convert = convert;
//# sourceMappingURL=index.js.map