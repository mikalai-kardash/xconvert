import { IJsArray } from "./jsarray";
import { IJsObject } from "./jsobject";
import { IJsProperty } from "./jsproperty";

interface IJsVisitor {
    visitObject(obj: IJsObject): void;
    visitProperty(prop: IJsProperty): void;
    visitArray(arr: IJsArray): void;
}

interface IJsVisitable {
    Accept(visitor: IJsVisitor);
}

export {
    IJsVisitor,
    IJsVisitable,
};
