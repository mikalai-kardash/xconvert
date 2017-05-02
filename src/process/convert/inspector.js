"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Inspector = (function () {
    function Inspector(current) {
        this.current = current;
    }
    // tslint:disable-next-line:no-empty
    Inspector.prototype.visitDoc = function (doc) {
    };
    // tslint:disable-next-line:no-empty
    Inspector.prototype.visitComment = function (node) {
    };
    // tslint:disable-next-line:no-empty
    Inspector.prototype.visitText = function (text) {
    };
    // tslint:disable-next-line:no-empty
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
            if (items.length === 0) {
                return;
            }
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
exports.default = Inspector;

//# sourceMappingURL=inspector.js.map
