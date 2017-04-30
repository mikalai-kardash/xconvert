interface IJsVisitor {
    visitObject(obj: IJsObject): void;
    visitProperty(prop: IJsProperty): void;
    visitArray(arr: IJsArray): void;
}

interface IJsVisitable {
    Accept(visitor:IJsVisitor);
}

interface IJsObject extends IJsVisitable {
    properties: IJsProperty[];
}

interface IJsProperty extends IJsVisitable {
    name: string;
    value: IJsObject | IJsArray | string;
}

interface IJsArray extends IJsVisitable {
    children: (string | IJsObject)[];
}