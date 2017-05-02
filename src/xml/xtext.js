"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XText = (function () {
    function XText(Text) {
        this.Text = Text;
    }
    XText.prototype.Accept = function (visitor) {
        visitor.visitText(this);
    };
    return XText;
}());
exports.default = XText;

//# sourceMappingURL=xtext.js.map
