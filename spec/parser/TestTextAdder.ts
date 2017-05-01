class TestTextAdder implements ITextAdder {
    public text: IXText;

    public addText(text: IXText): void {
        this.text = text;
    }
}

export default TestTextAdder;
