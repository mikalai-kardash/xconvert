import { IJsArray, IJsObject, IJsProperty, IJsVisitor } from "../../js/schema";
interface IWriter {
    beginObject(): void;
    endObject(): void;
    startPropertyName(): void;
    endPropertyName(): void;
    appendPropertyEqual(): void;
    appendPropertySeparator(): void;
    appendArrayItemSeparator(): void;
    append(s: string): void;
    startStrignValue(): void;
    endStrignValue(): void;
    startArray(): void;
    endArray(): void;
    getText(): string;
}
declare class Writer implements IJsVisitor, IWriter {
    private text;
    private objectVisitor;
    private arrayVisitor;
    private propertyVisitor;
    beginObject(): void;
    endObject(): void;
    getText(): string;
    startPropertyName(): void;
    endPropertyName(): void;
    appendPropertyEqual(): void;
    append(s: string): void;
    startStrignValue(): void;
    endStrignValue(): void;
    appendPropertySeparator(): void;
    startArray(): void;
    endArray(): void;
    appendArrayItemSeparator(): void;
    visitObject(obj: IJsObject): void;
    visitProperty(prop: IJsProperty): void;
    visitArray(arr: IJsArray): void;
}
export { IWriter, Writer };
