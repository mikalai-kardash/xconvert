"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsdoc_1 = require("./jsdoc");
var Properties;
(function (Properties) {
    Properties.Text = "@text";
    Properties.Version = "@version";
    Properties.Encoding = "@encoding";
    Properties.Items = "@items";
    Properties.Name = "@name";
})(Properties || (Properties = {}));
var CurrentObject = (function () {
    function CurrentObject(current) {
        this.current = current;
    }
    CurrentObject.prototype.SetText = function (text) {
        var prop = this.createProperty(Properties.Text, text);
        if (prop)
            this.current.properties.push(prop);
    };
    CurrentObject.prototype.SetName = function (name) {
        var prop = this.createProperty(Properties.Name, name);
        if (prop)
            this.current.properties.push(prop);
    };
    CurrentObject.prototype.SetItems = function (items) {
        var _this = this;
        if (items.length == 0)
            return;
        var arr = new jsdoc_1.JsArray();
        items.forEach(function (i) {
            if (i.Text) {
                var t = i;
                arr.children.push(t.Text);
                return;
            }
            var n = i;
            if (n.Name) {
                var co = _this.newJsObject();
                arr.children.push(co);
                n.Accept(new Inspector(new CurrentObject(co)));
            }
        });
        var prop = new jsdoc_1.JsProperty(Properties.Items, arr);
        this.current.properties.push(prop);
    };
    CurrentObject.prototype.SetProperty = function (name, value) {
        var prop = this.createProperty(name, value);
        if (prop)
            this.current.properties.push(prop);
    };
    CurrentObject.prototype.newJsObject = function () {
        return new jsdoc_1.JsObject();
    };
    CurrentObject.prototype.createProperty = function (name, value) {
        if ((!!value) && value.length > 0) {
            return new jsdoc_1.JsProperty(name, value);
        }
        return null;
    };
    return CurrentObject;
}());
var Inspector = (function () {
    function Inspector(current) {
        this.current = current;
    }
    Inspector.prototype.visitDoc = function (doc) {
    };
    Inspector.prototype.visitComment = function (node) {
    };
    Inspector.prototype.visitText = function (text) {
    };
    Inspector.prototype.visitAttribute = function (attr) {
    };
    Inspector.prototype.visitNode = function (node) {
        var _this = this;
        this.current.SetName(node.Name);
        if (node.Attributes) {
            node.Attributes.forEach(function (a) {
                _this.current.SetProperty(a.Name, a.Value);
            });
        }
        if (node.Children.length > 0) {
            var textNodes = [];
            var nodes = [];
            var textNodeIsTheFirstOne = false;
            var items = node.Children.filter(function (c) {
                return !(c.Comment);
            });
            if (items.length === 0)
                return;
            if (items[0].Text) {
                var t = items.shift();
                this.current.SetText(t.Text);
            }
            if (items.length > 0) {
                this.current.SetItems(items);
            }
        }
    };
    return Inspector;
}());
var Converter = (function () {
    function Converter() {
    }
    Converter.prototype.Convert = function (document) {
        var current = new jsdoc_1.JsObject();
        var version = this.createProperty(Properties.Version, document.Version);
        var encoding = this.createProperty(Properties.Encoding, document.Encoding);
        if (version)
            current.properties.push(version);
        if (encoding)
            current.properties.push(encoding);
        if (document.Root) {
            var obj = new jsdoc_1.JsObject();
            current.properties.push(new jsdoc_1.JsProperty(document.Root.Name, obj));
            document.Root.Accept(new Inspector(new CurrentObject(obj)));
        }
        return current;
    };
    Converter.prototype.createProperty = function (name, value) {
        if ((!!value) && value.length > 0) {
            return new jsdoc_1.JsProperty(name, value);
        }
        return null;
    };
    return Converter;
}());
exports.Converter = Converter;
function convert(xml) {
    var converter = new Converter();
    return converter.Convert(xml);
}
exports.convert = convert;
//# sourceMappingURL=converter.js.map