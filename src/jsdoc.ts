class JsObject implements IJsObject {
    properties: IJsProperty[] = [];

    Accept(visitor: IJsVisitor): void {
        visitor.visitObject(this);
    }    
}

class JsArray implements IJsArray {
    children: (string | IJsObject)[] = [];

    Accept(visitor: IJsVisitor) {
        visitor.visitArray(this);
    }
}

class JsProperty implements IJsProperty {
    constructor(
        public name: string, 
        public value: string | IJsObject | IJsArray) {}

    Accept(visitor: IJsVisitor) {
        visitor.visitProperty(this);
    }
}

export {
    JsArray,
    JsProperty,
    JsObject
}