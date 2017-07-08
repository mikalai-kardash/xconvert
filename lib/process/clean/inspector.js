"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("../../xml/schema");
var Inspector = (function () {
    function Inspector() {
    }
    Inspector.prototype.visitDoc = function (doc) {
        var _this = this;
        this.document = this.copyDoc(doc);
        if (doc.Comments) {
            doc.Comments.forEach(function (c) {
                c.Accept(_this);
            });
        }
        if (doc.Root) {
            doc.Root.Accept(this);
        }
    };
    Inspector.prototype.visitNode = function (node) {
        var _this = this;
        if (node.Name === "") {
            return;
        }
        var copy = this.copyNode(node);
        if (this.currentNode) {
            this.currentNode.Children.push(copy);
        }
        else {
            this.document.Root = copy;
        }
        this.currentNode = copy;
        if (node.Attributes) {
            node.Attributes.forEach(function (a) {
                a.Accept(_this);
            });
        }
        if (node.Children) {
            node.Children.forEach(function (c) {
                c.Accept(_this);
                _this.currentNode = copy;
            });
        }
    };
    // tslint:disable-next-line:no-empty
    Inspector.prototype.visitComment = function (comment) {
    };
    Inspector.prototype.visitText = function (text) {
        var t = text.Text;
        t = this.truncateString(t);
        if (t.length === 0) {
            return;
        }
        var copy = new schema_1.XText(t);
        if (this.currentNode) {
            this.currentNode.Children.push(copy);
        }
    };
    Inspector.prototype.visitAttribute = function (attr) {
        if (attr.Value === "") {
            return;
        }
        var v = attr.Value;
        var n = attr.Name;
        v = this.truncateString(v);
        if (v === "") {
            return;
        }
        if (n === "") {
            return;
        }
        if (this.currentNode) {
            this.currentNode.Attributes.push(schema_1.XAttribute.Get(n, v));
        }
    };
    Inspector.prototype.truncateString = function (s) {
        return s
            .replace(/^[\s]*/, "")
            .replace(/[\s]*$/, "");
    };
    Inspector.prototype.copyNode = function (node) {
        return new schema_1.XNode(node.Name);
    };
    Inspector.prototype.copyDoc = function (doc) {
        var copy = new schema_1.XDoc();
        copy.Version = doc.Version;
        copy.Encoding = doc.Encoding;
        return copy;
    };
    return Inspector;
}());
exports.default = Inspector;

//# sourceMappingURL=../../lib/process/clean/inspector.js.map
