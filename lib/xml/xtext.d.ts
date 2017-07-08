import { IVisitable, IVisitor } from "./visitor";
interface IXText extends IVisitable {
    Text: string;
}
declare class XText implements IXText {
    Text: string;
    constructor(Text: string);
    Accept(visitor: IVisitor): void;
}
export { IXText, XText };
