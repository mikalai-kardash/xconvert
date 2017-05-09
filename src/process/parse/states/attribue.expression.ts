import { XAttribute } from "../../../xml/schema";
import { IAttributeAdder, INameSetter, IValueSetter } from "../setters";
import { IState, IStateManager } from "../states";
import * as Symbols from "../symbols";
import Name from "./name";
import Value from "./value";

class AttributeExpression implements IState, INameSetter, IValueSetter {
    public name: string = "";
    public value: string = "";

    constructor(
        public manager: IStateManager,
        public prev: IState,
        public attributeSetter: IAttributeAdder) { }

    public read(ch: string): void {
        switch (ch) {
            case Symbols.Equal:
                const value = new Value(this.manager, this, this);
                this.switchTo(value);
                break;

            case Symbols.Space:
                this.switchBack();
                this.prev.read(ch);
                break;

            default:
                const name = new Name(this.manager, this, this);
                this.switchTo(name);
                name.read(ch);
                break;
        }
    }

    public switchBack(): void {
        this.attributeSetter.addAttribute(
            XAttribute.Get(this.name, this.value));

        this.manager.switchTo(this.prev);
    }

    public switchTo(state: IState): void {
        this.manager.switchTo(state);
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setValue(value: string): void {
        this.value = value;
        this.switchBack();
    }
}

export default AttributeExpression;
