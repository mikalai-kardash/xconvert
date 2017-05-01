import * as Symbols from "../symbols";

class Value implements IState {
    public temp: string = "";
    public count: number = 0;
    public startedWith: string = "";

    constructor(
        public manager: IStateManager,
        public prev: IState,
        public valueSetter: IValueSetter) { }

    public read(ch: string): void {
        switch (ch) {

            case Symbols.SingleQuote:
            case Symbols.DoubleQuote:
                if (this.count === 0) {
                    this.startedWith = ch;
                }

                this.count ++;
                if (this.count > 1 && this.startedWith === ch) {
                    this.manager.switchTo(this.prev);
                    this.valueSetter.setValue(this.temp);
                    return;
                }

                if (this.startedWith !== ch) {
                    this.temp += ch;
                }
                break;

            default:
                this.temp += ch;
                break;
        }
    }
}

export default Value;
