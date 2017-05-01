class XText implements IXText {
    constructor(public Text: string) {}

    public Accept(visitor: IVisitor): void {
        visitor.visitText(this);
    }
}

export default XText;
