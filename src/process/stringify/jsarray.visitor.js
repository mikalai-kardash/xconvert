"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsArrayVisitor = (function () {
    function JsArrayVisitor(writer, visitor) {
        this.writer = writer;
        this.visitor = visitor;
    }
    JsArrayVisitor.prototype.visit = function (arr) {
        var _this = this;
        this.writer.startArray();
        arr.children.forEach(function (c, i) {
            if (i > 0) {
                _this.writer.appendArrayItemSeparator();
            }
            if (c.length) {
                _this.writer.startStrignValue();
                _this.writer.append(c);
                _this.writer.endStrignValue();
                return;
            }
            if (c.properties) {
                var o = c;
                o.Accept(_this.visitor);
                return;
            }
        });
        this.writer.endArray();
    };
    return JsArrayVisitor;
}());
exports.default = JsArrayVisitor;
//# sourceMappingURL=jsarray.visitor.js.map