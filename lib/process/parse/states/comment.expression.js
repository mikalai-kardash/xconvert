"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xcomment_1 = require("../../../xml/xcomment");
var CommentExpression = (function () {
    function CommentExpression(manager, prev, commentsAdder) {
        this.manager = manager;
        this.prev = prev;
        this.commentsAdder = commentsAdder;
        this.sequence = "";
    }
    CommentExpression.prototype.read = function (ch) {
        this.sequence += ch;
        if (this.endsWith("-->")) {
            this.switchBack();
        }
    };
    CommentExpression.prototype.endsWith = function (s) {
        if (this.sequence.length < s.length) {
            return false;
        }
        var end = this.sequence.substring(this.sequence.length - s.length);
        return end === s;
    };
    CommentExpression.prototype.switchBack = function () {
        this.manager.switchTo(this.prev);
        var comment = this.sequence.substring(0, this.sequence.length - 3);
        this.commentsAdder.addComments(new xcomment_1.XComment(comment));
        this.sequence = "";
    };
    return CommentExpression;
}());
exports.default = CommentExpression;

//# sourceMappingURL=../../../lib/process/parse/states/comment.expression.js.map
