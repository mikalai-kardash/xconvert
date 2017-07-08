"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsProperty = (function () {
    function JsProperty(name, value) {
        this.name = name;
        this.value = value;
    }
    JsProperty.prototype.Accept = function (visitor) {
        visitor.visitProperty(this);
    };
    return JsProperty;
}());
exports.JsProperty = JsProperty;

//# sourceMappingURL=../lib/js/jsproperty.js.map
