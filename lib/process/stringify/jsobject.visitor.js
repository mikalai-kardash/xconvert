"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsObjectVisitor = (function () {
    function JsObjectVisitor(writer, visitor) {
        this.writer = writer;
        this.visitor = visitor;
    }
    JsObjectVisitor.prototype.visit = function (obj) {
        var _this = this;
        this.writer.beginObject();
        obj.properties.forEach(function (p, i) {
            if (i > 0) {
                _this.writer.appendPropertySeparator();
            }
            p.Accept(_this.visitor);
        });
        this.writer.endObject();
    };
    return JsObjectVisitor;
}());
exports.default = JsObjectVisitor;

//# sourceMappingURL=../../lib/process/stringify/jsobject.visitor.js.map
