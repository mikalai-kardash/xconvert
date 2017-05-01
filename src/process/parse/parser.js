"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xdoc_1 = require("../../xml/xdoc");
var default_1 = require("./states/default");
var Parser = (function () {
    function Parser() {
        this.position = 0;
    }
    Parser.prototype.switchTo = function (state) {
        this.current = state;
    };
    Parser.prototype.read = function (ch) {
        this.current.read(ch);
    };
    Parser.prototype.jump = function (n) {
        this.position += n;
    };
    Parser.prototype.Parse = function (xmlContent) {
        var d = new default_1.default(this, null);
        this.switchTo(d);
        this.position = 0;
        for (; this.position < xmlContent.length; this.position++) {
            var ch = xmlContent[this.position];
            this.read(ch);
        }
        var xDoc = new xdoc_1.default();
        var attrs = d.attributes;
        attrs.forEach(function (a) {
            switch (a.Name) {
                case "version":
                    xDoc.Version = a.Value;
                    break;
                case "encoding":
                    xDoc.Encoding = a.Value;
                    break;
            }
        });
        if (d.nodes.length !== 0) {
            xDoc.Root = d.nodes[0];
        }
        var comments = d.comments;
        if (comments.length > 0) {
            xDoc.Comments = [];
            comments.forEach(function (c) {
                xDoc.Comments.push(c);
            });
        }
        return xDoc;
    };
    return Parser;
}());
exports.Parser = Parser;
function parse(xml) {
    var parser = new Parser();
    return parser.Parse(xml);
}
exports.parse = parse;
//# sourceMappingURL=parser.js.map