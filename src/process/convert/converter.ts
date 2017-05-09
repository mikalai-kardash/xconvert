import { JsArray, JsObject, JsProperty } from "../../js/schema";
import { IVisitor, IXDoc } from "../../xml/schema";
import { CurrentObject } from "./current.object";
import Inspector from "./inspector";
import * as Properties from "./properties";

interface IConverter {
    Convert(document: IXDoc): IJsObject;
}

class Converter implements IConverter {
    public Convert(document: IXDoc): IJsObject {
        const current = new JsObject();

        const version = this.createProperty(Properties.Version, document.Version);
        const encoding = this.createProperty(Properties.Encoding, document.Encoding);

        if (version) {
            current.properties.push(version);
        }

        if (encoding) {
            current.properties.push(encoding);
        }

        if (document.Root) {
            const obj = new JsObject();

            current.properties.push(
                new JsProperty(document.Root.Name, obj));

            document.Root.Accept(
                new Inspector(new CurrentObject(obj)) as IVisitor);
        }

        return current;
    }

    public createProperty(name: string, value: string): IJsProperty {
        if ((!!value) && value.length > 0) {
            return new JsProperty(name, value);
        }
        return null;
    }
}

function convert(xml: IXDoc): IJsObject {
    const converter: IConverter = new Converter();
    return converter.Convert(xml);
}

export {
    convert,
    Converter,
    IConverter,
};
