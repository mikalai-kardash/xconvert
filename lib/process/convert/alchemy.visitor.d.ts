import { IJsObject } from "../../js/schema";
import { IVisitor, IXAttribute, IXComment, IXDoc, IXNode, IXText } from "../../xml/schema";
declare class Alchemy implements IVisitor {
    private objects;
    getDocument(): IJsObject;
    visitDoc(doc: IXDoc): void;
    visitNode(node: IXNode): void;
    visitComment(node: IXComment): void;
    visitText(text: IXText): void;
    visitAttribute(attr: IXAttribute): void;
    private getCurrent();
    private addProperty(prop);
    private appendToParent(node);
    private createProperty(name, value);
}
export { Alchemy };
