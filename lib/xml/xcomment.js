"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XComment = (function () {
    function XComment(Comment) {
        this.Comment = Comment;
    }
    XComment.prototype.Accept = function (visitor) {
        visitor.visitComment(this);
    };
    return XComment;
}());
exports.XComment = XComment;

//# sourceMappingURL=../lib/xml/xcomment.js.map
