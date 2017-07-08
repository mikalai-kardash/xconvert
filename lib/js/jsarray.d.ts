import { IJsObject } from "./jsobject";
import { IJsVisitable, IJsVisitor } from "./visitor";
interface IJsArray extends IJsVisitable {
    children: Array<string | IJsObject>;
}
declare class JsArray implements IJsArray {
    children: Array<string | IJsObject>;
    Accept(visitor: IJsVisitor): void;
}
export { IJsArray, JsArray };
