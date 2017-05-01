"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xtext_1 = require("../../../xml/xtext");
var Symbols = require("../symbols");
var TextExpression = (function () {
    function TextExpression(manager, prev, textAdder) {
        this.manager = manager;
        this.prev = prev;
        this.textAdder = textAdder;
        this.text = "";
    }
    TextExpression.prototype.read = function (ch) {
        switch (ch) {
            case Symbols.NodeOpening:
                this.switchBack();
                this.prev.read(ch);
                break;
            default:
                this.text += ch;
                break;
        }
    };
    TextExpression.prototype.switchBack = function () {
        this.manager.switchTo(this.prev);
        this.textAdder.addText(new xtext_1.default(this.text));
    };
    return TextExpression;
}());
exports.default = TextExpression;
//# sourceMappingURL=text.expression.js.map