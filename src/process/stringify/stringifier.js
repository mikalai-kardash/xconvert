"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var writer_1 = require("./writer");
var Stringifier = (function () {
    function Stringifier() {
    }
    Stringifier.prototype.Stringify = function (js) {
        if (js === undefined) {
            return undefined;
        }
        if (js === null) {
            return "null";
        }
        var w = new writer_1.Writer();
        js.Accept(w);
        return w.getText();
    };
    return Stringifier;
}());
exports.Stringifier = Stringifier;
function stringify(js) {
    var s = new Stringifier();
    return s.Stringify(js);
}
exports.stringify = stringify;
//# sourceMappingURL=stringifier.js.map