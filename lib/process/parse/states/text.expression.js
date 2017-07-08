"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("../../../xml/schema");
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
                this.manager.jump(-1);
                break;
            default:
                this.text += ch;
                break;
        }
    };
    TextExpression.prototype.switchBack = function () {
        this.manager.switchTo(this.prev);
        this.textAdder.addText(new schema_1.XText(this.text));
    };
    return TextExpression;
}());
exports.default = TextExpression;

//# sourceMappingURL=../../../lib/process/parse/states/text.expression.js.map
