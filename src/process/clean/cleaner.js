"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inspector_1 = require("./inspector");
var Cleaner = (function () {
    function Cleaner() {
    }
    Cleaner.prototype.clean = function (xml) {
        var i = new inspector_1.default();
        xml.Accept(i);
        return i.document;
    };
    return Cleaner;
}());
exports.Cleaner = Cleaner;
function clean(xml) {
    var cleaner = new Cleaner();
    return cleaner.clean(xml);
}
exports.clean = clean;

//# sourceMappingURL=cleaner.js.map
