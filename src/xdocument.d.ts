interface IVisitor {
    Visit(node: IXNode): void;
}

interface IVisitable {
    Accept(visitor: IVisitor): void;
}

interface IXDoc {
    Version?: string;
    Encoding?: string;
    Comments?: IXComment[];
    Root?: IXNode;
}

interface IXText {
    Text: string;
}

interface IXComment {
    Comment: string;
}

interface IXNode extends IVisitable {
    Name: string;

    Attributes?: IXAttribute[];
    Children?: (IXNode | IXText | IXComment ) [];
}

interface IXAttribute {
    Name: string;
    Value: string;
}

