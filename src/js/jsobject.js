"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsObject = (function () {
    function JsObject() {
        this.properties = [];
    }
    JsObject.prototype.Accept = function (visitor) {
        visitor.visitObject(this);
    };
    return JsObject;
}());
exports.default = JsObject;

//# sourceMappingURL=jsobject.js.map
