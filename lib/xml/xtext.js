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
exports.XText = XText;

//# sourceMappingURL=../lib/xml/xtext.js.map
