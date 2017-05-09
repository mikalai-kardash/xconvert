import { IJsArray, IJsObject } from "../../js/schema";
import { Writer } from "./writer";

interface IStringifier {
    Stringify(js: IJsObject | IJsArray): string;
}

class Stringifier implements IStringifier {
    public Stringify(js: IJsObject | IJsArray): string {
        if (js === undefined) {
            return undefined;
        }

        if (js === null) {
            return "null";
        }

        const w = new Writer();
        js.Accept(w);

        return w.getText();
    }
}

function stringify(js: IJsObject | IJsArray): string {
    const s: IStringifier = new Stringifier();
    return s.Stringify(js);
}

export {
    IStringifier,
    Stringifier,
    stringify,
};
