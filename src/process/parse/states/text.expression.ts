import XText from "../../../xml/xtext";
import * as Symbols from "../symbols";

class TextExpression implements IState {
    public text: string = "";

    constructor(
        public manager: IStateManager,
        public prev: IState,
        public textAdder: ITextAdder) { }

    public read(ch: string): void {
        switch (ch) {
            case Symbols.NodeOpening:
                this.switchBack();
                this.prev.read(ch);
                break;

            default:
                this.text += ch;
                break;
        }
    }

    public switchBack(): void {
        this.manager.switchTo(this.prev);
        this.textAdder.addText(new XText(this.text));
    }
}

export default TextExpression;
