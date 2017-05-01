"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XAttribute = (function () {
    function XAttribute(Name) {
        this.Name = Name;
        this.Value = "";
    }
    XAttribute.Get = function (name, value) {
        var attr = new XAttribute(name);
        attr.Value = value;
        return attr;
    };
    XAttribute.prototype.Accept = function (visitor) {
        visitor.visitAttribute(this);
    };
    return XAttribute;
}());
exports.default = XAttribute;
//# sourceMappingURL=xattribute.js.map