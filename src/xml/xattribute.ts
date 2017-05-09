import { IVisitable, IVisitor } from "./visitor";

interface IXAttribute extends IVisitable {
    Name: string;
    Value: string;
}

class XAttribute implements IXAttribute {
    public static Get(name: string, value: string): IXAttribute {
        const attr = new XAttribute(name);
        attr.Value = value;
        return attr;
    }

    public Value: string = "";

    constructor(
        public Name: string) {}

    public Accept(visitor: IVisitor): void {
        visitor.visitAttribute(this);
    }
}

export {
    IXAttribute,
    XAttribute,
};
