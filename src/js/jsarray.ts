class JsArray implements IJsArray {
    public children: Array<string | IJsObject> = [];

    public Accept(visitor: IJsVisitor) {
        visitor.visitArray(this);
    }
}

export default JsArray;
