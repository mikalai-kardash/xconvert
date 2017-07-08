import { IJsObject } from "../../js/schema";
import { IXDoc } from "../../xml/schema";
interface IConverter {
    Convert(document: IXDoc): IJsObject;
}
declare class Converter implements IConverter {
    Convert(document: IXDoc): IJsObject;
}
declare function convert(xml: IXDoc): IJsObject;
export { convert, Converter, IConverter };
