import { IVisitable, IVisitor } from "./visitor";
interface IXComment extends IVisitable {
    Comment: string;
}
declare class XComment implements IXComment {
    Comment: string;
    constructor(Comment: string);
    Accept(visitor: IVisitor): void;
}
export { IXComment, XComment };
