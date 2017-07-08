import { IJsArray, IJsObject } from "../../js/schema";
interface IStringifier {
    Stringify(js: IJsObject | IJsArray): string;
}
declare class Stringifier implements IStringifier {
    Stringify(js: IJsObject | IJsArray): string;
}
declare function stringify(js: IJsObject | IJsArray): string;
export { IStringifier, Stringifier, stringify };
