import { IJsArray } from "./jsarray";
import { IJsObject } from "./jsobject";
import { IJsVisitable, IJsVisitor } from "./visitor";

interface IJsProperty extends IJsVisitable {
    name: string;
    value: IJsObject | IJsArray | string;
}

class JsProperty implements IJsProperty {
    constructor(
        public name: string,
        public value: string | IJsObject | IJsArray) {}

    public Accept(visitor: IJsVisitor) {
        visitor.visitProperty(this);
    }
}

export {
    IJsProperty,
    JsProperty,
};
