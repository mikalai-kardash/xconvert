import { IAttributeAdder } from "../../lib/process/parse/setters";
import { IXAttribute } from "../../lib/xml/schema";

class TestAttributeAdder implements IAttributeAdder {
    public attr: IXAttribute;
    public all: IXAttribute[] = [];

    public addAttribute(attr: IXAttribute): void {
        this.attr = attr;
        this.all.push(attr);
    }
}

export default TestAttributeAdder;
