class XNode implements IXNode, IVisitable {
    public Attributes: IXAttribute[] = [];
    public Children: Array<IXNode | IXText | IXComment> = [];

    constructor(public Name: string) {
    }

    public Accept(visitor: IVisitor): void {
        visitor.visitNode(this);
    }
}

export default XNode;
