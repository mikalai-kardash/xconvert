import { IXAttribute } from "./xattribute";
import { IXComment } from "./xcomment";
import { IXDoc } from "./xdoc";
import { IXNode } from "./xnode";
import { IXText } from "./xtext";
interface IVisitor {
    visitDoc(doc: IXDoc): any;
    visitNode(node: IXNode): any;
    visitComment(node: IXComment): any;
    visitText(text: IXText): any;
    visitAttribute(attr: IXAttribute): any;
}
interface IVisitable {
    Accept(visitor: IVisitor): void;
}
export { IVisitor, IVisitable };
