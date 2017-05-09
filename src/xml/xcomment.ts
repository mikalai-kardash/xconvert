import { IVisitable, IVisitor } from "./visitor";

interface IXComment extends IVisitable {
    Comment: string;
}

class XComment implements IXComment {
    constructor(public Comment: string) {}

    public Accept(visitor: IVisitor): void {
        visitor.visitComment(this);
    }
}

export {
    IXComment,
    XComment,
};
