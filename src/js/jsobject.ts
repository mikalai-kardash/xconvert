import { IJsProperty } from "./jsproperty";
import { IJsVisitable, IJsVisitor } from "./visitor";

interface IJsObject extends IJsVisitable {
    properties: IJsProperty[];
}

class JsObject implements IJsObject {
    public properties: IJsProperty[] = [];

    public Accept(visitor: IJsVisitor): void {
        visitor.visitObject(this);
    }
}

export {
    IJsObject,
    JsObject,
};
