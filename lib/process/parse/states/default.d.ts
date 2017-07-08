import { IXAttribute, IXComment, IXNode } from "../../../xml/schema";
import { IAttributeAdder, ICommentsAdder, INodeAdder } from "../setters";
import { IState, IStateManager } from "../states";
declare class Default implements IState, IAttributeAdder, INodeAdder, ICommentsAdder {
    manager: IStateManager;
    prev: IState;
    previousChar: string;
    sequence: string;
    attributes: IXAttribute[];
    nodes: IXNode[];
    comments: IXComment[];
    constructor(manager: IStateManager, prev: IState);
    read(ch: string): void;
    addAttribute(attr: IXAttribute): void;
    addNode(node: IXNode): void;
    addComments(comments: IXComment): void;
    switchTo(state: IState): void;
    endsWith(s: string): boolean;
}
export default Default;
