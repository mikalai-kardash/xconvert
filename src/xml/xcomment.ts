class XComment implements IXComment {
    constructor(public Comment: string) {}

    public Accept(visitor: IVisitor): void {
        visitor.visitComment(this);
    }
}

export default XComment;
