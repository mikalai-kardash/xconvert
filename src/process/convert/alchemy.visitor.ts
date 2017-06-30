import { IJsArray, IJsObject, IJsProperty, JsArray, JsObject, JsProperty } from "../../js/schema";
import { IVisitor, IXAttribute, IXComment, IXDoc, IXNode, IXText } from "../../xml/schema";
import * as Properties from "./properties";

class Alchemy implements IVisitor {
    private objects: IJsObject[] = [];

    public getDocument(): IJsObject {
        if (this.objects.length === 0) {
            return null;
        }
        return this.objects.shift();
    }

    public visitDoc(doc: IXDoc) {
        this.objects.unshift(new JsObject());

        const encoding = this.createProperty(Properties.Encoding, doc.Encoding);
        const version = this.createProperty(Properties.Version, doc.Version);

        this.addProperty(version);
        this.addProperty(encoding);

        const root = doc.Root;
        if (root) { root.Accept(this); }
    }

    public visitNode(node: IXNode) {
        const jsNode = this.appendToParent(node);

        this.objects.unshift(jsNode);

        this.addProperty(this.createProperty(Properties.Name, node.Name));

        if (node.Attributes) {
            node.Attributes.forEach((a) => { a.Accept(this); });
        }

        if (node.Children) {
            node.Children.forEach((c) => {
                c.Accept(this);
            });
        }

        this.objects.shift();
    }

    // tslint:disable-next-line:no-empty
    public visitComment(node: IXComment) {
    }

    public visitText(text: IXText) {
        this.addProperty(this.createProperty(Properties.Text, text.Text));
    }

    public visitAttribute(attr: IXAttribute) {
        this.addProperty(this.createProperty(attr.Name, attr.Value));
    }

    private getCurrent(): IJsObject {
        return this.objects[0];
    }

    private addProperty(prop: JsProperty): void {
        if (prop) {
            this.getCurrent().properties.push(prop);
        }
    }

    private appendToParent(node: IXNode): IJsObject {
        const jsNode = new JsObject();

        if (this.objects.length === 1) {
            this.addProperty(new JsProperty(node.Name, jsNode));
        } else {
            const current = this.getCurrent();
            const items = current.properties.find((p) => {
                return p.name === Properties.Items;
            });

            if (items) {
                const arr = items.value as IJsArray;
                arr.children.push(jsNode);
            } else {
                const arr = new JsArray();
                this.addProperty(new JsProperty(Properties.Items, arr));

                arr.children.push(jsNode);
            }
        }

        return jsNode;
    }

    private createProperty(name: string, value: string): IJsProperty {
        if ((!!value) && value.length > 0) {
            return new JsProperty(name, value);
        }
        return null;
    }
}

export {
    Alchemy,
};
