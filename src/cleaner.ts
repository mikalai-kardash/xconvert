import { XDoc, XNode, XAttribute, XText } from './xdoc';

interface ICleaner {
    clean(xml: IXDoc): IXDoc;
}

type visitable = IXDoc | IXNode;

class Inspector implements IVisitor {

    document: IXDoc;

    private currentNode: IXNode;

    visitDoc(doc: IXDoc): void {
        this.document = this.copyDoc(doc);

        if (doc.Comments) {
            doc.Comments.forEach((c) => {
                c.Accept(this);
            });
        }

        if (doc.Root) {
            doc.Root.Accept(this);
        }
    }

    visitNode(node: IXNode) {
        if (node.Name === '') return;

        let copy = this.copyNode(node);

        if (this.currentNode) {
            this.currentNode.Children.push(copy);
        } else {
            this.document.Root = copy;
        }

        this.currentNode = copy;

        if (node.Attributes) {
            node.Attributes.forEach((a) => {
                a.Accept(this);
            });
        }

        if (node.Children) {
            node.Children.forEach((c) => {
                c.Accept(this);
                this.currentNode = copy;
            });
        }
    }

    visitComment(comment: IXComment) {
        this.ignore();
    }

    visitText(text: IXText) {

        let t = text.Text;

        t = this.truncateString(t);

        if (t.length === 0) return;

        let copy = new XText(t);

        if (this.currentNode) {
            this.currentNode.Children.push(copy);
        }
    }

    visitAttribute(attr: IXAttribute) {
        if (attr.Value === '') return;

        let v = attr.Value;
        let n = attr.Name;

        v = this.truncateString(v);

        if (v === '') return;
        if (n === '') return;

        if (this.currentNode) {
            this.currentNode.Attributes.push(
                XAttribute.Get(n, v)
            );
        }
    }

    private ignore() {}

    private truncateString(s: string): string {
        return s
            .replace(/^[\s]*/, '')
            .replace(/[\s]*$/, '');
    }

    private copyNode(node: IXNode): IXNode {
        return new XNode(node.Name);
    }

    private copyDoc(doc: IXDoc): IXDoc {
        let copy = new XDoc();
        copy.Version = doc.Version;
        copy.Encoding = doc.Encoding;
        return copy;
    }
}

class Cleaner implements ICleaner {
    clean(xml: IXDoc): IXDoc {
        let i = new Inspector();
        xml.Accept(i);
        return i.document;
    }
}

function clean(xml: IXDoc): IXDoc {
    let cleaner = new Cleaner();
    return cleaner.clean(xml);
}

export {
    ICleaner,
    Cleaner,
    clean
}