class TestAttributeAdder implements IAttributeAdder {
    public attr: IXAttribute;
    public all: IXAttribute[] = [];

    public addAttribute(attr: IXAttribute): void {
        this.attr = attr;
        this.all.push(attr);
    }
}

export default TestAttributeAdder;
