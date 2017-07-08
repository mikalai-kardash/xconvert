import { IJsArray } from "./jsarray";
import { IJsObject } from "./jsobject";
import { IJsVisitable, IJsVisitor } from "./visitor";
interface IJsProperty extends IJsVisitable {
    name: string;
    value: IJsObject | IJsArray | string;
}
declare class JsProperty implements IJsProperty {
    name: string;
    value: string | IJsObject | IJsArray;
    constructor(name: string, value: string | IJsObject | IJsArray);
    Accept(visitor: IJsVisitor): void;
}
export { IJsProperty, JsProperty };
