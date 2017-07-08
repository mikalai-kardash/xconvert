import { IJsObject, IJsVisitor } from "../../js/schema";
import { IWriter } from "./writer";
declare class JsObjectVisitor {
    private writer;
    private visitor;
    constructor(writer: IWriter, visitor: IJsVisitor);
    visit(obj: IJsObject): void;
}
export default JsObjectVisitor;
