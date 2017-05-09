import { IVisitable, IVisitor } from "./visitor";
import { IXAttribute } from "./xattribute";
import { IXComment } from "./xcomment";
import { IXText } from "./xtext";

interface IXNode extends IVisitable {
    Name: string;
    Attributes?: IXAttribute[];
    Children?: Array<IXNode | IXText | IXComment>;
}

class XNode implements IXNode, IVisitable {
    public Attributes: IXAttribute[] = [];
    public Children: Array<IXNode | IXText | IXComment> = [];

    constructor(public Name: string) {
    }

    public Accept(visitor: IVisitor): void {
        visitor.visitNode(this);
    }
}

export {
    IXNode,
    XNode,
};
