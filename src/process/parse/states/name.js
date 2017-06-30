"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Symbols = require("../symbols");
var Name = (function () {
    function Name(manager, prev, nameSetter) {
        this.manager = manager;
        this.prev = prev;
        this.nameSetter = nameSetter;
        this.temp = "";
    }
    Name.prototype.read = function (ch) {
        switch (ch) {
            case Symbols.Equal:
                this.nameSetter.setName(this.temp);
                this.manager.switchTo(this.prev);
                this.manager.jump(-1);
                break;
            default:
                this.temp += ch;
                break;
        }
    };
    return Name;
}());
exports.default = Name;

//# sourceMappingURL=name.js.map
