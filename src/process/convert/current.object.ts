import { JsArray, JsObject, JsProperty } from "../../js/schema";
import Inspector from "./inspector";
import * as Properties from "./properties";

type XItem = IXNode | IXText;

interface ICurrentObject {
    SetText(text: string): void;
    SetItems(items: XItem[]): void;
    SetName(name: string): void;
    SetProperty(name: string, value: string): void;
}

class CurrentObject implements ICurrentObject {
    constructor(private current: IJsObject) {}

    public SetText(text: string): void {
        const prop = this.createProperty(Properties.Text, text);
        if (prop) {
            this.current.properties.push(prop);
        }
    }

    public SetName(name: string): void {
        const prop = this.createProperty(Properties.Name, name);
        if (prop) {
            this.current.properties.push(prop);
        }
    }

    public SetItems(items: XItem[]): void {
        if (items.length === 0) {
            return;
        }

        const arr = new JsArray();

        items.forEach((i) => {
            if ((i as IXText).Text) {
                const t = i as IXText;
                arr.children.push(t.Text);
                return;
            }

            const n = i as IXNode;
            if (n.Name) {
                const co = this.newJsObject();

                arr.children.push(co);

                n.Accept(
                    new Inspector(
                        new CurrentObject(co)));
            }
        });

        const prop = new JsProperty(Properties.Items, arr);
        this.current.properties.push(prop);
    }

    public SetProperty(name: string, value: string): void {
        const prop = this.createProperty(name, value);
        if (prop) {
            this.current.properties.push(prop);
        }
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

export {
    CurrentObject,
    ICurrentObject,
    XItem,
};
