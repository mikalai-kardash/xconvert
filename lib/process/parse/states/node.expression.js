"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("../../../xml/schema");
var Expressions = require("../expressions");
var Symbols = require("../symbols");
var attribue_expression_1 = require("./attribue.expression");
var comment_expression_1 = require("./comment.expression");
var text_expression_1 = require("./text.expression");
var NodeExpression = (function () {
    function NodeExpression(manager, prev, nodeAdder) {
        this.manager = manager;
        this.prev = prev;
        this.nodeAdder = nodeAdder;
        this.attributes = [];
        this.children = [];
        this.name = "";
        this.closingTag = "";
        this.previousChar = "";
        this.readingName = true;
        this.readingAttributes = false;
        this.readingContents = false;
        this.waitingForClosingTag = false;
    }
    NodeExpression.prototype.read = function (ch) {
        if (this.readingName) {
            this.readName(ch);
        }
        if (this.readingAttributes) {
            this.readAttributes(ch);
            return;
        }
        if (this.readingContents) {
            this.readContents(ch);
        }
        if (this.waitingForClosingTag) {
            this.waitForClosingTag(ch);
        }
    };
    NodeExpression.prototype.readName = function (ch) {
        if (Expressions.NodeName.test(ch)) {
            this.name += ch;
        }
        else {
            this.readingName = false;
            this.readingAttributes = true;
        }
    };
    NodeExpression.prototype.readAttributes = function (ch) {
        switch (ch) {
            case Symbols.NodeClosing:
                this.readingAttributes = false;
                if (this.previousChar === Symbols.ForwardSlash) {
                    this.switchBack();
                    return;
                }
                this.readingContents = true;
                break;
            case Symbols.Space:
                break;
            case Symbols.ForwardSlash:
                this.previousChar = ch;
                break;
            default:
                var attr = new attribue_expression_1.default(this.manager, this, this);
                this.switchTo(attr);
                this.manager.jump(-1);
                break;
        }
    };
    NodeExpression.prototype.readContents = function (ch) {
        switch (ch) {
            case Symbols.NodeOpening:
                break;
            case Symbols.ForwardSlash:
                this.readingContents = false;
                this.waitingForClosingTag = true;
                break;
            default:
                if (this.previousChar === Symbols.NodeOpening) {
                    if (ch === Symbols.Exclamation) {
                        var comment = new comment_expression_1.default(this.manager, this, this);
                        this.manager.switchTo(comment);
                        this.manager.jump(2);
                    }
                    else {
                        var node = new NodeExpression(this.manager, this, this);
                        this.switchTo(node);
                        this.manager.jump(-1);
                    }
                }
                else {
                    var text = new text_expression_1.default(this.manager, this, this);
                    this.switchTo(text);
                    this.manager.jump(-1);
                }
                break;
        }
        this.previousChar = ch;
    };
    NodeExpression.prototype.waitForClosingTag = function (ch) {
        this.closingTag += ch;
        if (this.closingTag === "/" + this.name + ">") {
            this.switchBack();
        }
    };
    NodeExpression.prototype.switchBack = function () {
        this.manager.switchTo(this.prev);
        var xNode = new schema_1.XNode(this.name);
        if (this.attributes.length > 0) {
            xNode.Attributes = [];
            this.attributes.forEach(function (a) {
                xNode.Attributes.push(a);
            });
        }
        if (this.children.length > 0) {
            xNode.Children = [];
            this.children.forEach(function (c) {
                xNode.Children.push(c);
            });
        }
        this.nodeAdder.addNode(xNode);
    };
    NodeExpression.prototype.switchTo = function (state) {
        this.manager.switchTo(state);
    };
    NodeExpression.prototype.addAttribute = function (attr) {
        this.attributes.push(attr);
    };
    NodeExpression.prototype.addText = function (text) {
        this.children.push(text);
    };
    NodeExpression.prototype.addNode = function (node) {
        this.children.push(node);
    };
    NodeExpression.prototype.addComments = function (comment) {
        this.children.push(comment);
    };
    return NodeExpression;
}());
exports.default = NodeExpression;

//# sourceMappingURL=../../../lib/process/parse/states/node.expression.js.map
