import { ICommentsAdder } from "../setters";
import { IState, IStateManager } from "../states";
declare class CommentExpression implements IState {
    manager: IStateManager;
    prev: IState;
    commentsAdder: ICommentsAdder;
    sequence: string;
    constructor(manager: IStateManager, prev: IState, commentsAdder: ICommentsAdder);
    read(ch: string): void;
    endsWith(s: string): boolean;
    switchBack(): void;
}
export default CommentExpression;
