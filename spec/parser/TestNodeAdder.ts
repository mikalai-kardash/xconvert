class TestNodeAdder implements INodeAdder {
    public node: IXNode;

    public addNode(node: IXNode): void {
        this.node = node;
    }
}

export default TestNodeAdder;
