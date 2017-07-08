"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xdoc_1 = require("../../xml/xdoc");
var default_1 = require("./states/default");
var Parser = (function () {
    function Parser() {
        this.current = new default_1.default(this, null);
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
        this.position = 0;
        for (; this.position < xmlContent.length; this.position++) {
            var ch = xmlContent[this.position];
            this.read(ch);
        }
        return this.GetXmlDocument();
    };
    Parser.prototype.GetXmlDocument = function () {
        var d = this.current;
        var xDoc = new xdoc_1.XDoc();
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

//# sourceMappingURL=../../lib/process/parse/parser.js.map
