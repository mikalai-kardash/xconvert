import { IParser, parse, Parser } from "./process/parse/parser";
import AttributeExpression from "./process/parse/states/attribue.expression";
import CommentExpression from "./process/parse/states/comment.expression";
import Name from "./process/parse/states/name";
import NodeExpression from "./process/parse/states/node.expression";
import PrologExpression from "./process/parse/states/prolog";
import TextExpression from "./process/parse/states/text.expression";
import Value from "./process/parse/states/value";

export {
//    IAttributeAdder,
//    ICommentsAdder,
//    INameSetter,
//    INodeAdder,
    IParser,
//    IState,
//    IStateManager,
//    ITextAdder,
//    IValueSetter,

    AttributeExpression,
    CommentExpression,
    Name,
    NodeExpression,
    PrologExpression,
    Parser,
    TextExpression,
    Value,

    parse,
};
