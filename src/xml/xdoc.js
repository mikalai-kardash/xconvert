"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XDoc = (function () {
    function XDoc() {
        this.Version = "";
        this.Encoding = "";
        this.Comments = [];
        this.Root = null;
    }
    XDoc.prototype.Accept = function (visitor) {
        visitor.visitDoc(this);
    };
    return XDoc;
}());
exports.default = XDoc;

//# sourceMappingURL=xdoc.js.map
