import { INameSetter } from "../setters";
import { IState, IStateManager } from "../states";
import * as Symbols from "../symbols";

class Name implements IState {
    public temp: string = "";

    constructor(
        public manager: IStateManager,
        public prev: IState,
        public nameSetter: INameSetter) { }

    public read(ch: string): void {
        switch (ch) {
            case Symbols.Equal:
                this.nameSetter.setName(this.temp);
                this.manager.switchTo(this.prev);
                this.manager.jump(-1);
                break;

            default:
                this.temp += ch;
                break;
        }
    }
}

export default Name;
