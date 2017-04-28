interface IXDoc {
    Version: string;
    Encoding?: string;
    Comments?: IXComment[];
    Root: IXNode;
}

interface IXText {
    Text: string;
}

interface IXComment {
    Comment: string;
}

interface IXNode {
    Name: string;

    Attributes?: IXAttribute[];
    Children?: (IXNode | IXText | IXComment ) [];
}

interface IXAttribute {
    Name: string;
    Value: string;
}

