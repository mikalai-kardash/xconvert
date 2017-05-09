import { IXAttribute } from "../../../xml/schema";
import { IAttributeAdder } from "../setters";
import { IState, IStateManager } from "../states";
import * as Symbols from "../symbols";
import AttributeExpression from "./attribue.expression";

class PrologExpression implements IState, IAttributeAdder {
    public previousChar: string = "";
    public attributes: IXAttribute[] = [];

    constructor(
        public manager: IStateManager,
        public prev: IState,
        public attributeAdder: IAttributeAdder) { }

    public read(ch: string): void {

        switch (ch) {

            case Symbols.NodeClosing:
                if (this.previousChar === Symbols.Prolog) {
                    this.switchBack();
                }
                return;

            case "x":
            case "m":
            case "l":
                return;

            case Symbols.Prolog:
            case Symbols.Space:
                this.wait(ch);
                break;

            default:
                {
                    if (this.previousChar === Symbols.Space) {
                        this.previousChar = "";

                        const attribute = new AttributeExpression(this.manager, this, this);
                        this.switchTo(attribute);

                        attribute.read(ch);
                    } else {
                        this.wait(ch);
                    }
                }
                break;
        }
    }

    public wait(ch: string): void {
        this.previousChar = ch;
    }

    public addAttribute(attr: IXAttribute): void {
        this.attributes.push(attr);
    }

    public switchTo(state: IState): void {
        this.manager.switchTo(state);
    }

    public switchBack(): void {
        this.manager.switchTo(this.prev);
        this.attributes.forEach((a) => {
            this.attributeAdder.addAttribute(a);
        });
    }
}

export default PrologExpression;
