"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsPropertyVisitor = (function () {
    function JsPropertyVisitor(writer, visitor) {
        this.writer = writer;
        this.visitor = visitor;
    }
    JsPropertyVisitor.prototype.visit = function (prop) {
        this.writer.startPropertyName();
        this.writer.append(prop.name);
        this.writer.endPropertyName();
        this.writer.appendPropertyEqual();
        if (prop.value.length) {
            this.writer.startStrignValue();
            this.writer.append(prop.value);
            this.writer.endStrignValue();
            return;
        }
        if (prop.value.properties) {
            var o = prop.value;
            o.Accept(this.visitor);
            return;
        }
        if (prop.value.children) {
            var a = prop.value;
            a.Accept(this.visitor);
            return;
        }
    };
    return JsPropertyVisitor;
}());
exports.default = JsPropertyVisitor;

//# sourceMappingURL=../../lib/process/stringify/jsproperty.visitor.js.map
