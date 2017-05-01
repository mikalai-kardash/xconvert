class JsObject implements IJsObject {
    public properties: IJsProperty[] = [];

    public Accept(visitor: IJsVisitor): void {
        visitor.visitObject(this);
    }
}

export default JsObject;
