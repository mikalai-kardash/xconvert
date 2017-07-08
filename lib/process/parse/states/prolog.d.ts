import { IXAttribute } from "../../../xml/schema";
import { IAttributeAdder } from "../setters";
import { IState, IStateManager } from "../states";
declare class PrologExpression implements IState, IAttributeAdder {
    manager: IStateManager;
    prev: IState;
    attributeAdder: IAttributeAdder;
    previousChar: string;
    attributes: IXAttribute[];
    constructor(manager: IStateManager, prev: IState, attributeAdder: IAttributeAdder);
    read(ch: string): void;
    wait(ch: string): void;
    addAttribute(attr: IXAttribute): void;
    switchTo(state: IState): void;
    switchBack(): void;
}
export default PrologExpression;
