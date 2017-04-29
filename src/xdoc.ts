class XNode implements IXNode, IVisitable {
    
    constructor(public Name: string) {
    }

    Attributes: IXAttribute[] = [];
    Children : (IXNode | IXText | IXComment ) [] = [];
    
    Accept(visitor: IVisitor): void {
        visitor.Visit(this);
    }
}

class XDoc implements IXDoc {
    Accept(visitor: IVisitor): void {
    }
}

class XText implements IXText {
    constructor(public Text: string) {}

    Accept(visitor: IVisitor): void {
    }
}

class XComment implements IXComment {
    constructor(public Comment: string) {}

    Accept(visitor: IVisitor): void {
        throw new Error('Method not implemented.');
    }
}

class XAttribute implements IXAttribute {
    constructor(
        public Name: string) {}

    Value: string = '';

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