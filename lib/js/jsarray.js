"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsArray = (function () {
    function JsArray() {
        this.children = [];
    }
    JsArray.prototype.Accept = function (visitor) {
        visitor.visitArray(this);
    };
    return JsArray;
}());
exports.JsArray = JsArray;

//# sourceMappingURL=../lib/js/jsarray.js.map
