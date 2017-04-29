"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XNode = (function () {
    function XNode(Name) {
        this.Name = Name;
        this.Attributes = [];
        this.Children = [];
    }
    XNode.prototype.Accept = function (visitor) {
        visitor.Visit(this);
    };
    return XNode;
}());
exports.XNode = XNode;
var XDoc = (function () {
    function XDoc() {
    }
    XDoc.prototype.Accept = function (visitor) {
    };
    return XDoc;
}());
exports.XDoc = XDoc;
var XText = (function () {
    function XText(Text) {
        this.Text = Text;
    }
    XText.prototype.Accept = function (visitor) {
    };
    return XText;
}());
exports.XText = XText;
var XComment = (function () {
    function XComment(Comment) {
        this.Comment = Comment;
    }
    XComment.prototype.Accept = function (visitor) {
        throw new Error('Method not implemented.');
    };
    return XComment;
}());
exports.XComment = XComment;
var XAttribute = (function () {
    function XAttribute(Name) {
        this.Name = Name;
        this.Value = '';
    }
    XAttribute.Get = function (name, value) {
        var attr = new XAttribute(name);
        attr.Value = value;
        return attr;
    };
    return XAttribute;
}());
exports.XAttribute = XAttribute;
//# sourceMappingURL=xdoc.js.map