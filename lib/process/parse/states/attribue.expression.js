"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("../../../xml/schema");
var Symbols = require("../symbols");
var name_1 = require("./name");
var value_1 = require("./value");
var AttributeExpression = (function () {
    function AttributeExpression(manager, prev, attributeSetter) {
        this.manager = manager;
        this.prev = prev;
        this.attributeSetter = attributeSetter;
        this.name = "";
        this.value = "";
    }
    AttributeExpression.prototype.read = function (ch) {
        switch (ch) {
            case Symbols.Equal:
                var value = new value_1.default(this.manager, this, this);
                this.switchTo(value);
                break;
            case Symbols.Space:
                this.switchBack();
                this.manager.jump(-1);
                break;
            default:
                var name = new name_1.default(this.manager, this, this);
                this.switchTo(name);
                this.manager.jump(-1);
                break;
        }
    };
    AttributeExpression.prototype.switchBack = function () {
        this.attributeSetter.addAttribute(schema_1.XAttribute.Get(this.name, this.value));
        this.manager.switchTo(this.prev);
    };
    AttributeExpression.prototype.switchTo = function (state) {
        this.manager.switchTo(state);
    };
    AttributeExpression.prototype.setName = function (name) {
        this.name = name;
    };
    AttributeExpression.prototype.setValue = function (value) {
        this.value = value;
        this.switchBack();
    };
    return AttributeExpression;
}());
exports.default = AttributeExpression;

//# sourceMappingURL=../../../lib/process/parse/states/attribue.expression.js.map
