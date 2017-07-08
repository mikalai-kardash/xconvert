import { IVisitable, IVisitor } from "./visitor";
import { IXComment } from "./xcomment";
import { IXNode } from "./xnode";
interface IXDoc extends IVisitable {
    Version?: string;
    Encoding?: string;
    Comments?: IXComment[];
    Root?: IXNode;
}
declare class XDoc implements IXDoc {
    Version: string;
    Encoding: string;
    Comments: IXComment[];
    Root: IXNode;
    Accept(visitor: IVisitor): void;
}
export { IXDoc, XDoc };
