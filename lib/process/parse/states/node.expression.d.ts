import { IXAttribute, IXComment, IXNode, IXText } from "../../../xml/schema";
import { IAttributeAdder, ICommentsAdder, INodeAdder, ITextAdder } from "../setters";
import { IState, IStateManager } from "../states";
declare class NodeExpression implements IState, IAttributeAdder, ITextAdder, INodeAdder, ICommentsAdder {
    manager: IStateManager;
    prev: IState;
    nodeAdder: INodeAdder;
    attributes: IXAttribute[];
    children: Array<IXNode | IXText | IXComment>;
    name: string;
    closingTag: string;
    previousChar: string;
    readingName: boolean;
    readingAttributes: boolean;
    readingContents: boolean;
    waitingForClosingTag: boolean;
    constructor(manager: IStateManager, prev: IState, nodeAdder: INodeAdder);
    read(ch: string): void;
    readName(ch: string): void;
    readAttributes(ch: string): void;
    readContents(ch: string): void;
    waitForClosingTag(ch: string): void;
    switchBack(): void;
    switchTo(state: IState): void;
    addAttribute(attr: IXAttribute): void;
    addText(text: IXText): void;
    addNode(node: IXNode): void;
    addComments(comment: IXComment): void;
}
export default NodeExpression;