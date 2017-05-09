import { IVisitor, IXAttribute, IXComment, IXDoc, IXNode, IXText } from "../../xml/schema";
import { ICurrentObject } from "./current.object";

class Inspector implements IVisitor {
    constructor(
        private current: ICurrentObject) {}

    // tslint:disable-next-line:no-empty
    public visitDoc(doc: IXDoc) {
    }

    // tslint:disable-next-line:no-empty
    public visitComment(node: IXComment) {
    }

    // tslint:disable-next-line:no-empty
    public visitText(text: IXText) {
    }

    // tslint:disable-next-line:no-empty
    public visitAttribute(attr: IXAttribute) {
    }

    public visitNode(node: IXNode): void {
        this.current.SetName(node.Name);

        if (node.Attributes) {
            node.Attributes.forEach((a) => {
                this.current.SetProperty(a.Name, a.Value);
            });
        }

        if (node.Children.length > 0) {

            const textNodes: IXText[] = [];
            const nodes: IXNode[] = [];
            const textNodeIsTheFirstOne = false;

            const items: Array<IXText | IXNode> = node.Children.filter((c) => {
                return !((c as IXComment).Comment);
            }) as Array<IXText | IXNode>;

            if (items.length === 0) {
                return;
            }

            if ((items[0] as IXText).Text) {
                const t = items.shift() as IXText;
                this.current.SetText(t.Text);
            }

            if (items.length > 0) {
                this.current.SetItems(items);
            }
        }
    }
}

export default Inspector;
