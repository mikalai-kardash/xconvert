import { JsObject, JsArray, JsProperty } from './jsdoc';

interface IConverter {
    Convert(document:IXDoc): IJsObject;
}

type XItem = IXNode | IXText;
type JsPropertyValue = IJsObject | string;

interface ICurrentObject {
    SetText(text: string): void;
    SetItems(items: XItem[]): void;
    SetName(name: string): void;
    SetProperty(name: string, value: string): void;
}

namespace Properties {
    export const Text       = "@text";
    export const Version    = "@version";
    export const Encoding   = "@encoding";
    export const Items      = "@items";
    export const Name       = "@name";
}

class CurrentObject implements ICurrentObject {
    constructor(private current: IJsObject) {}

    SetText(text: string): void {
        let prop = this.createProperty(Properties.Text, text);
        if (prop) this.current.properties.push(prop);
    }

    SetName(name: string): void {
        let prop = this.createProperty(Properties.Name, name);
        if (prop) this.current.properties.push(prop);
    }

    SetItems(items: XItem[]): void {
        if (items.length == 0) return;

        let arr = new JsArray();

        items.forEach((i) => {
            if ((<IXText>i).Text) {
                let t = <IXText>i;
                arr.children.push(t.Text);
                return;
            }

            let n = <IXNode>i;
            if (n.Name) {
                let co = this.newJsObject();

                arr.children.push(co);

                n.Accept(
                    new Inspector(
                        new CurrentObject(co)));
            }
        });

        let prop = new JsProperty(Properties.Items, arr);
        this.current.properties.push(prop);
    }

    SetProperty(name: string, value: string): void {
        let prop = this.createProperty(name, value);
        if (prop) this.current.properties.push(prop);
    }

    private newJsObject(): IJsObject {
        return new JsObject();
    }

    private createProperty(name: string, value: string): IJsProperty {
        if ((!!value) && value.length > 0) {
            return new JsProperty(name, value);
        }
        return null;
    }
}

class Inspector implements IVisitor {
    
    constructor(
        private current: ICurrentObject) {}

    visitDoc(doc: IXDoc) {
    }
    
    visitComment(node: IXComment) {
    }
    
    visitText(text: IXText) {
    }
    
    visitAttribute(attr: IXAttribute) {
    }

    visitNode(node: IXNode): void {
        this.current.SetName(node.Name);

        if (node.Attributes) {
            node.Attributes.forEach((a) => {
                this.current.SetProperty(a.Name, a.Value);
            });
        }

        if (node.Children.length > 0) {

            let textNodes: IXText[] = [];
            let nodes: IXNode[] = [];
            let textNodeIsTheFirstOne = false;

            let items: (IXText | IXNode)[] = <(IXNode | IXText)[]>node.Children.filter((c) => {
                return !((<IXComment>c).Comment);
            });

            if (items.length === 0) return;

            if ((<IXText>items[0]).Text) {
                let t = <IXText>items.shift();
                this.current.SetText(t.Text);
            }

            if (items.length > 0) {
                this.current.SetItems(items);
            }
        }
    }
}

class Converter implements IConverter {
    Convert(document: IXDoc): IJsObject {
        let current = new JsObject();

        let version = this.createProperty(Properties.Version, document.Version);
        let encoding = this.createProperty(Properties.Encoding, document.Encoding);

        if (version) current.properties.push(version);
        if (encoding) current.properties.push(encoding);
        
        if (document.Root) {
            let obj = new JsObject();

            current.properties.push(
                new JsProperty(document.Root.Name, obj));

            document.Root.Accept(
                <IVisitor>new Inspector(
                    new CurrentObject(obj)));
        }

        return current;
    }

    createProperty(name: string, value: string): IJsProperty {
        if ((!!value) && value.length > 0) {
            return new JsProperty(name, value);
        }
        return null;
    }
}

function convert(xml: IXDoc): IJsObject {
    let converter: IConverter = new Converter();
    return converter.Convert(xml);
}

export { Converter, IConverter, convert };