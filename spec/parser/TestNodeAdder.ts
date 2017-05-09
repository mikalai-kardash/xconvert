import { INodeAdder } from "../../src/process/parse/setters";
import { IXNode } from "../../src/xml/schema";

class TestNodeAdder implements INodeAdder {
    public node: IXNode;

    public addNode(node: IXNode): void {
        this.node = node;
    }
}

export default TestNodeAdder;
