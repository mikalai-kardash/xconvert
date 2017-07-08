import { IVisitable, IVisitor } from "./visitor";
import { IXAttribute } from "./xattribute";
import { IXComment } from "./xcomment";
import { IXText } from "./xtext";
interface IXNode extends IVisitable {
    Name: string;
    Attributes?: IXAttribute[];
    Children?: Array<IXNode | IXText | IXComment>;
}
declare class XNode implements IXNode, IVisitable {
    Name: string;
    Attributes: IXAttribute[];
    Children: Array<IXNode | IXText | IXComment>;
    constructor(Name: string);
    Accept(visitor: IVisitor): void;
}
export { IXNode, XNode };
