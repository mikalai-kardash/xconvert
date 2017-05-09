import { XComment } from "../../../xml/xcomment";
import { ICommentsAdder } from "../setters";
import { IState, IStateManager } from "../states";

class CommentExpression implements IState {
    public sequence: string = "";

    constructor(
        public manager: IStateManager,
        public prev: IState,
        public commentsAdder: ICommentsAdder) { }

    public read(ch: string): void {
        this.sequence += ch;

        if (this.endsWith("-->")) {
            this.switchBack();
        }
    }

    public endsWith(s: string): boolean {
        if (this.sequence.length < s.length) {
            return false;
        }

        const end = this.sequence.substring(this.sequence.length - s.length);
        return end === s;
    }

    public switchBack(): void {
        this.manager.switchTo(this.prev);

        const comment = this.sequence.substring(0, this.sequence.length - 3);

        this.commentsAdder.addComments(new XComment(comment));
        this.sequence = "";
    }
}

export default CommentExpression;
