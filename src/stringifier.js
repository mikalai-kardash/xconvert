"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsObjectVisitor = (function () {
    function JsObjectVisitor(writer, visitor) {
        this.writer = writer;
        this.visitor = visitor;
    }
    JsObjectVisitor.prototype.visit = function (obj) {
        var _this = this;
        this.writer.beginObject();
        obj.properties.forEach(function (p, i) {
            if (i > 0) {
                _this.writer.appendPropertySeparator();
            }
            p.Accept(_this.visitor);
        });
        this.writer.endObject();
    };
    return JsObjectVisitor;
}());
var JsArrayVisitor = (function () {
    function JsArrayVisitor(writer, visitor) {
        this.writer = writer;
        this.visitor = visitor;
    }
    JsArrayVisitor.prototype.visit = function (arr) {
        var _this = this;
        this.writer.startArray();
        arr.children.forEach(function (c, i) {
            if (i > 0) {
                _this.writer.appendArrayItemSeparator();
            }
            if (c.length) {
                _this.writer.startStrignValue();
                _this.writer.append(c);
                _this.writer.endStrignValue();
                return;
            }
            if (c.properties) {
                var o = c;
                o.Accept(_this.visitor);
                return;
            }
        });
        this.writer.endArray();
    };
    return JsArrayVisitor;
}());
var JsPropertyVisitor = (function () {
    function JsPropertyVisitor(writer, visitor) {
        this.writer = writer;
        this.visitor = visitor;
    }
    JsPropertyVisitor.prototype.visit = function (prop) {
        this.writer.startPropertyName();
        this.writer.append(prop.name);
        this.writer.endPropertyName();
        this.writer.appendPropertyEqual();
        if (prop.value.length) {
            this.writer.startStrignValue();
            this.writer.append(prop.value);
            this.writer.endStrignValue();
            return;
        }
        if (prop.value.properties) {
            var o = prop.value;
            o.Accept(this.visitor);
            return;
        }
        if (prop.value.children) {
            var a = prop.value;
            a.Accept(this.visitor);
            return;
        }
    };
    return JsPropertyVisitor;
}());
var Writer = (function () {
    function Writer() {
        this.text = '';
        this.objectVisitor = new JsObjectVisitor(this, this);
        this.arrayVisitor = new JsArrayVisitor(this, this);
        this.propertyVisitor = new JsPropertyVisitor(this, this);
    }
    Writer.prototype.beginObject = function () {
        this.text += '{';
    };
    Writer.prototype.endObject = function () {
        this.text += '}';
    };
    Writer.prototype.getText = function () {
        return this.text;
    };
    Writer.prototype.startPropertyName = function () {
        this.text += '"';
    };
    Writer.prototype.endPropertyName = function () {
        this.text += '"';
    };
    Writer.prototype.appendPropertyEqual = function () {
        this.text += ':';
    };
    Writer.prototype.append = function (s) {
        this.text += s;
    };
    Writer.prototype.startStrignValue = function () {
        this.text += '"';
    };
    Writer.prototype.endStrignValue = function () {
        this.text += '"';
    };
    Writer.prototype.appendPropertySeparator = function () {
        this.text += ',';
    };
    Writer.prototype.startArray = function () {
        this.text += '[';
    };
    Writer.prototype.endArray = function () {
        this.text += ']';
    };
    Writer.prototype.appendArrayItemSeparator = function () {
        this.text += ',';
    };
    Writer.prototype.visitObject = function (obj) {
        this.objectVisitor.visit(obj);
    };
    Writer.prototype.visitProperty = function (prop) {
        this.propertyVisitor.visit(prop);
    };
    Writer.prototype.visitArray = function (arr) {
        this.arrayVisitor.visit(arr);
    };
    return Writer;
}());
var Stringifier = (function () {
    function Stringifier() {
    }
    Stringifier.prototype.Stringify = function (js) {
        if (js === undefined)
            return undefined;
        if (js === null)
            return 'null';
        var w = new Writer();
        js.Accept(w);
        return w.getText();
    };
    return Stringifier;
}());
exports.Stringifier = Stringifier;
function stringify(js) {
    var s = new Stringifier();
    return s.Stringify(js);
}
exports.stringify = stringify;
//# sourceMappingURL=stringifier.js.map