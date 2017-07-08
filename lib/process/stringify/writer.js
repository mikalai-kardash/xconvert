"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsarray_visitor_1 = require("./jsarray.visitor");
var jsobject_visitor_1 = require("./jsobject.visitor");
var jsproperty_visitor_1 = require("./jsproperty.visitor");
var Writer = (function () {
    function Writer() {
        this.text = "";
        this.objectVisitor = new jsobject_visitor_1.default(this, this);
        this.arrayVisitor = new jsarray_visitor_1.default(this, this);
        this.propertyVisitor = new jsproperty_visitor_1.default(this, this);
    }
    Writer.prototype.beginObject = function () {
        this.text += "{";
    };
    Writer.prototype.endObject = function () {
        this.text += "}";
    };
    Writer.prototype.getText = function () {
        return this.text;
    };
    Writer.prototype.startPropertyName = function () {
        this.text += '"';
    };
    Writer.prototype.endPropertyName = function () {
        this.text += '"';
    };
    Writer.prototype.appendPropertyEqual = function () {
        this.text += ":";
    };
    Writer.prototype.append = function (s) {
        this.text += s;
    };
    Writer.prototype.startStrignValue = function () {
        this.text += '"';
    };
    Writer.prototype.endStrignValue = function () {
        this.text += '"';
    };
    Writer.prototype.appendPropertySeparator = function () {
        this.text += ",";
    };
    Writer.prototype.startArray = function () {
        this.text += "[";
    };
    Writer.prototype.endArray = function () {
        this.text += "]";
    };
    Writer.prototype.appendArrayItemSeparator = function () {
        this.text += ",";
    };
    Writer.prototype.visitObject = function (obj) {
        this.objectVisitor.visit(obj);
    };
    Writer.prototype.visitProperty = function (prop) {
        this.propertyVisitor.visit(prop);
    };
    Writer.prototype.visitArray = function (arr) {
        this.arrayVisitor.visit(arr);
    };
    return Writer;
}());
exports.Writer = Writer;

//# sourceMappingURL=../../lib/process/stringify/writer.js.map
