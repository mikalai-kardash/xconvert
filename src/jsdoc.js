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
exports.JsObject = JsObject;
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
//# sourceMappingURL=jsdoc.js.map