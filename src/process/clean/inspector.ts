import { XAttribute, XDoc, XNode, XText } from "../../xml/schema";

class Inspector implements IVisitor {
    public document: IXDoc;
    private currentNode: IXNode;

    public visitDoc(doc: IXDoc): void {
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

    public visitNode(node: IXNode) {
        if (node.Name === "") {
            return;
        }

        const copy = this.copyNode(node);

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

    // tslint:disable-next-line:no-empty
    public visitComment(comment: IXComment) {
    }

    public visitText(text: IXText) {

        let t = text.Text;

        t = this.truncateString(t);

        if (t.length === 0) {
            return;
        }

        const copy = new XText(t);

        if (this.currentNode) {
            this.currentNode.Children.push(copy);
        }
    }

    public visitAttribute(attr: IXAttribute) {
        if (attr.Value === "") {
            return;
        }

        let v = attr.Value;
        const n = attr.Name;

        v = this.truncateString(v);

        if (v === "") {
            return;
        }

        if (n === "") {
            return;
        }

        if (this.currentNode) {
            this.currentNode.Attributes.push(
                XAttribute.Get(n, v));
        }
    }

    private truncateString(s: string): string {
        return s
            .replace(/^[\s]*/, "")
            .replace(/[\s]*$/, "");
    }

    private copyNode(node: IXNode): IXNode {
        return new XNode(node.Name);
    }

    private copyDoc(doc: IXDoc): IXDoc {
        const copy = new XDoc();
        copy.Version = doc.Version;
        copy.Encoding = doc.Encoding;
        return copy;
    }
}

export default Inspector;
