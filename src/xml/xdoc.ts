class XDoc implements IXDoc {
    public Version: string = "";
    public Encoding: string = "";
    public Comments: IXComment[] = [];
    public Root: IXNode = null;

    public Accept(visitor: IVisitor): void {
        visitor.visitDoc(this);
    }
}

export default XDoc;
