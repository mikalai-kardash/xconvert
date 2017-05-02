"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Symbols = require("../symbols");
var attribue_expression_1 = require("./attribue.expression");
var PrologExpression = (function () {
    function PrologExpression(manager, prev, attributeAdder) {
        this.manager = manager;
        this.prev = prev;
        this.attributeAdder = attributeAdder;
        this.previousChar = "";
        this.attributes = [];
    }
    PrologExpression.prototype.read = function (ch) {
        switch (ch) {
            case Symbols.NodeClosing:
                if (this.previousChar === Symbols.Prolog) {
                    this.switchBack();
                }
                return;
            case "x":
            case "m":
            case "l":
                return;
            case Symbols.Prolog:
            case Symbols.Space:
                this.wait(ch);
                break;
            default:
                {
                    if (this.previousChar === Symbols.Space) {
                        this.previousChar = "";
                        var attribute = new attribue_expression_1.default(this.manager, this, this);
                        this.switchTo(attribute);
                        attribute.read(ch);
                    }
                    else {
                        this.wait(ch);
                    }
                }
                break;
        }
    };
    PrologExpression.prototype.wait = function (ch) {
        this.previousChar = ch;
    };
    PrologExpression.prototype.addAttribute = function (attr) {
        this.attributes.push(attr);
    };
    PrologExpression.prototype.switchTo = function (state) {
        this.manager.switchTo(state);
    };
    PrologExpression.prototype.switchBack = function () {
        var _this = this;
        this.manager.switchTo(this.prev);
        this.attributes.forEach(function (a) {
            _this.attributeAdder.addAttribute(a);
        });
    };
    return PrologExpression;
}());
exports.default = PrologExpression;

//# sourceMappingURL=prolog.js.map
