"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XNode = (function () {
    function XNode(Name) {
        this.Name = Name;
        this.Attributes = [];
        this.Children = [];
    }
    XNode.prototype.Accept = function (visitor) {
        visitor.visitNode(this);
    };
    return XNode;
}());
exports.default = XNode;

//# sourceMappingURL=xnode.js.map
