"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("../../js/schema");
var inspector_1 = require("./inspector");
var Properties = require("./properties");
var CurrentObject = (function () {
    function CurrentObject(current) {
        this.current = current;
    }
    CurrentObject.prototype.SetText = function (text) {
        var prop = this.createProperty(Properties.Text, text);
        if (prop) {
            this.current.properties.push(prop);
        }
    };
    CurrentObject.prototype.SetName = function (name) {
        var prop = this.createProperty(Properties.Name, name);
        if (prop) {
            this.current.properties.push(prop);
        }
    };
    CurrentObject.prototype.SetItems = function (items) {
        var _this = this;
        if (items.length === 0) {
            return;
        }
        var arr = new schema_1.JsArray();
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
                n.Accept(new inspector_1.default(new CurrentObject(co)));
            }
        });
        var prop = new schema_1.JsProperty(Properties.Items, arr);
        this.current.properties.push(prop);
    };
    CurrentObject.prototype.SetProperty = function (name, value) {
        var prop = this.createProperty(name, value);
        if (prop) {
            this.current.properties.push(prop);
        }
    };
    CurrentObject.prototype.newJsObject = function () {
        return new schema_1.JsObject();
    };
    CurrentObject.prototype.createProperty = function (name, value) {
        if ((!!value) && value.length > 0) {
            return new schema_1.JsProperty(name, value);
        }
        return null;
    };
    return CurrentObject;
}());
exports.CurrentObject = CurrentObject;

//# sourceMappingURL=current.object.js.map
