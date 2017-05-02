"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("../../js/schema");
var current_object_1 = require("./current.object");
var inspector_1 = require("./inspector");
var Properties = require("./properties");
var Converter = (function () {
    function Converter() {
    }
    Converter.prototype.Convert = function (document) {
        var current = new schema_1.JsObject();
        var version = this.createProperty(Properties.Version, document.Version);
        var encoding = this.createProperty(Properties.Encoding, document.Encoding);
        if (version) {
            current.properties.push(version);
        }
        if (encoding) {
            current.properties.push(encoding);
        }
        if (document.Root) {
            var obj = new schema_1.JsObject();
            current.properties.push(new schema_1.JsProperty(document.Root.Name, obj));
            document.Root.Accept(new inspector_1.default(new current_object_1.CurrentObject(obj)));
        }
        return current;
    };
    Converter.prototype.createProperty = function (name, value) {
        if ((!!value) && value.length > 0) {
            return new schema_1.JsProperty(name, value);
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
