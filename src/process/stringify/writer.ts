import JsArrayVisitor from "./jsarray.visitor";
import JsObjectVisitor from "./jsobject.visitor";
import JsPropertyVisitor from "./jsproperty.visitor";

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

class Writer implements IJsVisitor, IWriter {

    private text: string = "";

    private objectVisitor = new JsObjectVisitor(this, this);
    private arrayVisitor = new JsArrayVisitor(this, this);
    private propertyVisitor = new JsPropertyVisitor(this, this);

    public beginObject(): void {
        this.text += "{";
    }

    public endObject(): void {
        this.text += "}";
    }

    public getText(): string {
        return this.text;
    }

    public startPropertyName(): void {
        this.text += '"';
    }

    public endPropertyName(): void {
        this.text += '"';
    }

    public appendPropertyEqual(): void {
        this.text += ":";
    }

    public append(s: string): void {
        this.text += s;
    }

    public startStrignValue(): void {
        this.text += '"';
    }

    public endStrignValue(): void {
        this.text += '"';
    }

    public appendPropertySeparator(): void {
        this.text += ",";
    }

    public startArray(): void {
        this.text += "[";
    }

    public endArray(): void {
        this.text += "]";
    }

    public appendArrayItemSeparator(): void {
        this.text += ",";
    }

    public visitObject(obj: IJsObject): void {
        this.objectVisitor.visit(obj);
    }

    public visitProperty(prop: IJsProperty): void {
        this.propertyVisitor.visit(prop);
    }

    public visitArray(arr: IJsArray): void {
        this.arrayVisitor.visit(arr);
    }
}

export {
    IWriter,
    Writer,
};
