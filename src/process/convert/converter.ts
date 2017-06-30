import { IJsObject } from "../../js/schema";
import { IXDoc } from "../../xml/schema";
import { Alchemy } from "./alchemy.visitor";

interface IConverter {
    Convert(document: IXDoc): IJsObject;
}

class Converter implements IConverter {
    public Convert(document: IXDoc): IJsObject {
        const alchemy = new Alchemy();
        document.Accept(alchemy);
        return alchemy.getDocument();
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
