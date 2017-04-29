interface IJsObject {
    properties: IJsProperty[];
}

interface IJsProperty {
    name: string;
    value: IJsObject | IJsArray | string;
}

interface IJsArray {
    children: (string | IJsObject)[];
}