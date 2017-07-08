import { INodeAdder } from "../../lib/process/parse/setters";
import { IXNode } from "../../lib/xml/schema";

class TestNodeAdder implements INodeAdder {
    public node: IXNode;

    public addNode(node: IXNode): void {
        this.node = node;
    }
}

export default TestNodeAdder;
