import { IXAttribute } from "./xattribute";
import { IXComment } from "./xcomment";
import { IXDoc } from "./xdoc";
import { IXNode } from "./xnode";
import { IXText } from "./xtext";

interface IVisitor {
    visitDoc(doc: IXDoc);
    visitNode(node: IXNode);
    visitComment(node: IXComment);
    visitText(text: IXText);
    visitAttribute(attr: IXAttribute);
}

interface IVisitable {
    Accept(visitor: IVisitor): void;
}

export {
    IVisitor,
    IVisitable,
};
