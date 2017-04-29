class XNode implements IXNode, IVisitable {
    
    constructor(public Name: string) {
    }

    Attributes: IXAttribute[] = [];
    Children : (IXNode | IXText | IXComment ) [] = [];
    
    Accept(visitor: IVisitor): void {
        visitor.visitNode(this);
    }
}

class XDoc implements IXDoc {
    
    Version: string = '';
    Encoding: string = '';

    Comments: IXComment[] = [];

    Root: IXNode = null;
    
    Accept(visitor: IVisitor): void {
        visitor.visitDoc(this);
    }
}

class XText implements IXText {
    constructor(public Text: string) {}

    Accept(visitor: IVisitor): void {
        visitor.visitText(this);
    }
}

class XComment implements IXComment {
    constructor(public Comment: string) {}

    Accept(visitor: IVisitor): void {
        visitor.visitComment(this);
    }
}

class XAttribute implements IXAttribute {
    constructor(
        public Name: string) {}

    Value: string = '';

    Accept(visitor: IVisitor): void {
        visitor.visitAttribute(this);
    }

    public static Get(name: string, value: string): IXAttribute {
        let attr = new XAttribute(name);
        attr.Value = value;
        return attr;
    }
}

export {
    XAttribute,
    XComment,
    XDoc,
    XNode,
    XText
}