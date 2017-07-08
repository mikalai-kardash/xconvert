"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var alchemy_visitor_1 = require("./alchemy.visitor");
var Converter = (function () {
    function Converter() {
    }
    Converter.prototype.Convert = function (document) {
        var alchemy = new alchemy_visitor_1.Alchemy();
        document.Accept(alchemy);
        return alchemy.getDocument();
    };
    return Converter;
}());
exports.Converter = Converter;
function convert(xml) {
    var converter = new Converter();
    return converter.Convert(xml);
}
exports.convert = convert;

//# sourceMappingURL=../../lib/process/convert/converter.js.map
