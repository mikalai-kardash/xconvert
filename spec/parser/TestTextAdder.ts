import { ITextAdder } from "../../lib/process/parse/setters";
import { IXText } from "../../lib/xml/schema";

class TestTextAdder implements ITextAdder {
    public text: IXText;

    public addText(text: IXText): void {
        this.text = text;
    }
}

export default TestTextAdder;
