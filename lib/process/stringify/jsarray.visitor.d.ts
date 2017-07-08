import { IJsArray, IJsVisitor } from "../../js/schema";
import { IWriter } from "./writer";
declare class JsArrayVisitor {
    private writer;
    private visitor;
    constructor(writer: IWriter, visitor: IJsVisitor);
    visit(arr: IJsArray): void;
}
export default JsArrayVisitor;
