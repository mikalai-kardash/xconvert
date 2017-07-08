import { ITextAdder } from "../setters";
import { IState, IStateManager } from "../states";
declare class TextExpression implements IState {
    manager: IStateManager;
    prev: IState;
    textAdder: ITextAdder;
    text: string;
    constructor(manager: IStateManager, prev: IState, textAdder: ITextAdder);
    read(ch: string): void;
    switchBack(): void;
}
export default TextExpression;
