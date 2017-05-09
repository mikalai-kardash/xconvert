import { IJsObject } from "./jsobject";
import { IJsVisitable, IJsVisitor } from "./visitor";

interface IJsArray extends IJsVisitable {
    children: Array<string | IJsObject>;
}

class JsArray implements IJsArray {
    public children: Array<string | IJsObject> = [];

    public Accept(visitor: IJsVisitor) {
        visitor.visitArray(this);
    }
}

export {
    IJsArray,
    JsArray,
};
