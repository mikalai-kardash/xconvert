import { ITextAdder } from "../../src/process/parse/setters";
import { IXText } from "../../src/xml/schema";

class TestTextAdder implements ITextAdder {
    public text: IXText;

    public addText(text: IXText): void {
        this.text = text;
    }
}

export default TestTextAdder;
