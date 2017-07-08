import { IVisitable, IVisitor } from "./visitor";
interface IXAttribute extends IVisitable {
    Name: string;
    Value: string;
}
declare class XAttribute implements IXAttribute {
    Name: string;
    static Get(name: string, value: string): IXAttribute;
    Value: string;
    constructor(Name: string);
    Accept(visitor: IVisitor): void;
}
export { IXAttribute, XAttribute };
