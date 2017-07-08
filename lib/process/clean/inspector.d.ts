import { IVisitor, IXAttribute, IXComment, IXDoc, IXNode, IXText } from "../../xml/schema";
declare class Inspector implements IVisitor {
    document: IXDoc;
    private currentNode;
    visitDoc(doc: IXDoc): void;
    visitNode(node: IXNode): void;
    visitComment(comment: IXComment): void;
    visitText(text: IXText): void;
    visitAttribute(attr: IXAttribute): void;
    private truncateString(s);
    private copyNode(node);
    private copyDoc(doc);
}
export default Inspector;
