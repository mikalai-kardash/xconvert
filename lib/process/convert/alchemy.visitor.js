"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("../../js/schema");
var Properties = require("./properties");
var Alchemy = (function () {
    function Alchemy() {
        this.objects = [];
    }
    Alchemy.prototype.getDocument = function () {
        if (this.objects.length === 0) {
            return null;
        }
        return this.objects.shift();
    };
    Alchemy.prototype.visitDoc = function (doc) {
        this.objects.unshift(new schema_1.JsObject());
        var encoding = this.createProperty(Properties.Encoding, doc.Encoding);
        var version = this.createProperty(Properties.Version, doc.Version);
        this.addProperty(version);
        this.addProperty(encoding);
        var root = doc.Root;
        if (root) {
            root.Accept(this);
        }
    };
    Alchemy.prototype.visitNode = function (node) {
        var _this = this;
        var jsNode = this.appendToParent(node);
        this.objects.unshift(jsNode);
        this.addProperty(this.createProperty(Properties.Name, node.Name));
        if (node.Attributes) {
            node.Attributes.forEach(function (a) { a.Accept(_this); });
        }
        if (node.Children) {
            node.Children.forEach(function (c) {
                c.Accept(_this);
            });
        }
        this.objects.shift();
    };
    // tslint:disable-next-line:no-empty
    Alchemy.prototype.visitComment = function (node) {
    };
    Alchemy.prototype.visitText = function (text) {
        this.addProperty(this.createProperty(Properties.Text, text.Text));
    };
    Alchemy.prototype.visitAttribute = function (attr) {
        this.addProperty(this.createProperty(attr.Name, attr.Value));
    };
    Alchemy.prototype.getCurrent = function () {
        return this.objects[0];
    };
    Alchemy.prototype.addProperty = function (prop) {
        if (prop) {
            this.getCurrent().properties.push(prop);
        }
    };
    Alchemy.prototype.appendToParent = function (node) {
        var jsNode = new schema_1.JsObject();
        if (this.objects.length === 1) {
            this.addProperty(new schema_1.JsProperty(node.Name, jsNode));
        }
        else {
            var current = this.getCurrent();
            var items = current.properties.find(function (p) {
                return p.name === Properties.Items;
            });
            if (items) {
                var arr = items.value;
                arr.children.push(jsNode);
            }
            else {
                var arr = new schema_1.JsArray();
                this.addProperty(new schema_1.JsProperty(Properties.Items, arr));
                arr.children.push(jsNode);
            }
        }
        return jsNode;
    };
    Alchemy.prototype.createProperty = function (name, value) {
        if ((!!value) && value.length > 0) {
            return new schema_1.JsProperty(name, value);
        }
        return null;
    };
    return Alchemy;
}());
exports.Alchemy = Alchemy;

//# sourceMappingURL=../../lib/process/convert/alchemy.visitor.js.map
