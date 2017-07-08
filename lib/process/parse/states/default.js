"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Expressions = require("../expressions");
var Symbols = require("../symbols");
var comment_expression_1 = require("./comment.expression");
var node_expression_1 = require("./node.expression");
var prolog_1 = require("./prolog");
var Default = (function () {
    function Default(manager, prev) {
        this.manager = manager;
        this.prev = prev;
        this.sequence = "";
        this.attributes = [];
        this.nodes = [];
        this.comments = [];
    }
    Default.prototype.read = function (ch) {
        this.sequence += ch;
        switch (ch) {
            case Symbols.NodeOpening:
                break;
            case Symbols.Prolog:
                if (this.previousChar === Symbols.NodeOpening) {
                    this.previousChar = "";
                    this.sequence = "";
                    var prolog = new prolog_1.default(this.manager, this, this);
                    this.switchTo(prolog);
                }
                break;
            default:
                if (this.previousChar === Symbols.NodeOpening && ch !== Symbols.ForwardSlash) {
                    var nodeName = Expressions.NodeName;
                    if (nodeName.test(ch)) {
                        this.previousChar = "";
                        this.sequence = "";
                        var node = new node_expression_1.default(this.manager, this, this);
                        this.switchTo(node);
                        this.manager.jump(-1);
                    }
                }
                else if (this.endsWith("<!--")) {
                    this.sequence = "";
                    var comment = new comment_expression_1.default(this.manager, this, this);
                    this.switchTo(comment);
                }
                break;
        }
        this.previousChar = ch;
    };
    Default.prototype.addAttribute = function (attr) {
        this.attributes.push(attr);
    };
    Default.prototype.addNode = function (node) {
        this.nodes.push(node);
    };
    Default.prototype.addComments = function (comments) {
        this.comments.push(comments);
    };
    Default.prototype.switchTo = function (state) {
        this.manager.switchTo(state);
    };
    Default.prototype.endsWith = function (s) {
        if (this.sequence.length < s.length) {
            return false;
        }
        var end = this.sequence.substring(this.sequence.length - s.length);
        return end === s;
    };
    return Default;
}());
exports.default = Default;

//# sourceMappingURL=../../../lib/process/parse/states/default.js.map
