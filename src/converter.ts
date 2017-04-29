interface IConverter {
    Convert(document:IXDoc): IJsObject;
}

type XItem = IXNode | IXText;
type JsPropertyValue = IJsObject | string;

interface ICurrentObject {
    SetText(text: string): void;
    // SetItem(item: XItem);
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

        let arr: IJsArray = {
            children: []
        };

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

        let prop: IJsProperty = {
            name: Properties.Items,
            value: arr
        };

        this.current.properties.push(prop);
    }

    SetItem(value: XItem): void {
        if ((<IXNode>value).Name) {
            let v = <IXNode>value;
            let o = this.newJsObject();

            let prop: IJsProperty = <IJsProperty>{
                name: v.Name,
                value: o
            };

            this.current.properties.push(prop);

            v.Accept(new Inspector(new CurrentObject(o)));
        }
    }

    SetProperty(name: string, value: string): void {
        let prop = this.createProperty(name, value);
        if (prop) this.current.properties.push(prop);
    }

    private newJsObject(): IJsObject {
        return {
            properties: []
        };
    }

    private createProperty(name: string, value: string): IJsProperty {
        if ((!!value) && value.length > 0) {
            return { 
                name: name, 
                value: value 
            };
        }
        return null;
    }
}

class Inspector implements IVisitor {
    constructor(private current: ICurrentObject) {}

    Visit(node: IXNode): void {
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
        let current: IJsObject = {
            properties: <IJsProperty[]>[]
        };

        let version = this.createProperty(Properties.Version, document.Version);
        let encoding = this.createProperty(Properties.Encoding, document.Encoding);

        if (version) current.properties.push(version);
        if (encoding) current.properties.push(encoding);
        
        if (document.Root) {
            let obj: IJsObject = {
                properties: <IJsProperty[]>[]
            };

            current.properties.push({
                name: document.Root.Name,
                value: obj,
            });

            document.Root.Accept(
                <IVisitor>new Inspector(new CurrentObject(obj)));
        }

        return current;
    }

    createProperty(name: string, value: string): IJsProperty {
        if ((!!value) && value.length > 0) {
            return { 
                name: name, 
                value: value 
            };
        }
        return null;
    }
}

export { Converter, IConverter };