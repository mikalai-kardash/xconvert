"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Symbols = require("../symbols");
var Value = (function () {
    function Value(manager, prev, valueSetter) {
        this.manager = manager;
        this.prev = prev;
        this.valueSetter = valueSetter;
        this.temp = "";
        this.count = 0;
        this.startedWith = "";
    }
    Value.prototype.read = function (ch) {
        switch (ch) {
            case Symbols.SingleQuote:
            case Symbols.DoubleQuote:
                if (this.count === 0) {
                    this.startedWith = ch;
                }
                this.count++;
                if (this.count > 1 && this.startedWith === ch) {
                    this.manager.switchTo(this.prev);
                    this.valueSetter.setValue(this.temp);
                    return;
                }
                if (this.startedWith !== ch) {
                    this.temp += ch;
                }
                break;
            default:
                this.temp += ch;
                break;
        }
    };
    return Value;
}());
exports.default = Value;
//# sourceMappingURL=value.js.map