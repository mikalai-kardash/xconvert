import { IJsProperty } from "./jsproperty";
import { IJsVisitable, IJsVisitor } from "./visitor";
interface IJsObject extends IJsVisitable {
    properties: IJsProperty[];
}
declare class JsObject implements IJsObject {
    properties: IJsProperty[];
    Accept(visitor: IJsVisitor): void;
}
export { IJsObject, JsObject };
