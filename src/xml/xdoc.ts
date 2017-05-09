import { IVisitable, IVisitor } from "./visitor";
import { IXComment } from "./xcomment";
import { IXNode } from "./xnode";

interface IXDoc extends IVisitable {
    Version?: string;
    Encoding?: string;
    Comments?: IXComment[];
    Root?: IXNode;
}

class XDoc implements IXDoc {
    public Version: string = "";
    public Encoding: string = "";
    public Comments: IXComment[] = [];
    public Root: IXNode = null;

    public Accept(visitor: IVisitor): void {
        visitor.visitDoc(this);
    }
}

export {
    IXDoc,
    XDoc,
};
