import { IJsProperty, IJsVisitor } from "../../js/schema";
import { IWriter } from "./writer";
declare class JsPropertyVisitor {
    private writer;
    private visitor;
    constructor(writer: IWriter, visitor: IJsVisitor);
    visit(prop: IJsProperty): void;
}
export default JsPropertyVisitor;
