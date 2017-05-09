import { IVisitable, IVisitor } from "./visitor";

interface IXText extends IVisitable {
    Text: string;
}

class XText implements IXText {
    constructor(public Text: string) {}

    public Accept(visitor: IVisitor): void {
        visitor.visitText(this);
    }
}

export {
    IXText,
    XText,
};
