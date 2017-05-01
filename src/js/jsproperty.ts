class JsProperty implements IJsProperty {
    constructor(
        public name: string,
        public value: string | IJsObject | IJsArray) {}

    public Accept(visitor: IJsVisitor) {
        visitor.visitProperty(this);
    }
}

export default JsProperty;
