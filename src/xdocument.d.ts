interface IVisitor {
    visitDoc(doc: IXDoc);
    visitNode(node: IXNode);
    visitComment(node: IXComment);
    visitText(text: IXText);
    visitAttribute(attr: IXAttribute);
}

interface IVisitable {
    Accept(visitor: IVisitor): void;
}

interface IXDoc extends IVisitable {
    Version?: string;
    Encoding?: string;
    Comments?: IXComment[];
    Root?: IXNode;
}

interface IXText extends IVisitable {
    Text: string;
}

interface IXComment extends IVisitable {
    Comment: string;
}

interface IXNode extends IVisitable {
    Name: string;

    Attributes?: IXAttribute[];
    Children?: (IXNode | IXText | IXComment ) [];
}

interface IXAttribute extends IVisitable {
    Name: string;
    Value: string;
}

