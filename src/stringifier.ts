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

class JsObjectVisitor {

    constructor(
        private writer: IWriter,
        private visitor: IJsVisitor) {}

    visit(obj: IJsObject): void {
        this.writer.beginObject();

        obj.properties.forEach((p, i) => {
            if (i > 0) {
                this.writer.appendPropertySeparator();
            }
            p.Accept(this.visitor);
        })

        this.writer.endObject();
    }
}

class JsArrayVisitor {
    constructor(
        private writer: IWriter,
        private visitor: IJsVisitor) {}
    
    visit(arr: IJsArray): void {
        this.writer.startArray();

        arr.children.forEach((c, i) => {

            if (i > 0) {
                this.writer.appendArrayItemSeparator();
            }

            if ((<string>c).length) {
                this.writer.startStrignValue();
                this.writer.append(<string>c);
                this.writer.endStrignValue();
                return;
            }

            if ((<IJsObject>c).properties) {

                let o = <IJsObject>c;
                o.Accept(this.visitor);
                return;
            }

        });

        this.writer.endArray();
    }
}

class JsPropertyVisitor {
    constructor(
        private writer: IWriter,
        private visitor: IJsVisitor) {}

    visit(prop: IJsProperty): void {
        this.writer.startPropertyName();
        this.writer.append(prop.name);
        this.writer.endPropertyName();

        this.writer.appendPropertyEqual();

        if ((<string>prop.value).length) {
            this.writer.startStrignValue();
            this.writer.append(<string>prop.value);
            this.writer.endStrignValue();
            return;
        }

        if ((<IJsObject>prop.value).properties) {
            let o = <IJsObject>prop.value
            o.Accept(this.visitor);
            return;
        }

        if ((<IJsArray>prop.value).children) {
            let a = <IJsArray>prop.value;
            a.Accept(this.visitor);
            return;
        }
    }
}

class Writer implements IJsVisitor, IWriter {

    private text: string = '';
    
    private objectVisitor = new JsObjectVisitor(this, this);
    private arrayVisitor = new JsArrayVisitor(this, this);
    private propertyVisitor = new JsPropertyVisitor(this, this);
    
    beginObject(): void {
        this.text += '{';
    }

    endObject(): void {
        this.text += '}';
    }

    getText(): string {
        return this.text;
    }

    startPropertyName(): void {
        this.text += '"';
    }

    endPropertyName(): void {
        this.text += '"';
    }

    appendPropertyEqual(): void {
        this.text += ':';
    }

    append(s: string): void {
        this.text += s;
    }

    startStrignValue(): void {
        this.text += '"';
    }

    endStrignValue(): void {
        this.text += '"';
    }

    appendPropertySeparator(): void {
        this.text += ',';
    }

    startArray(): void {
        this.text += '[';
    }

    endArray(): void {
        this.text += ']';
    }

    appendArrayItemSeparator(): void {
        this.text += ',';
    }

    visitObject(obj: IJsObject): void {
        this.objectVisitor.visit(obj);
    }

    visitProperty(prop: IJsProperty): void {
        this.propertyVisitor.visit(prop);
    }

    visitArray(arr: IJsArray): void {
        this.arrayVisitor.visit(arr);
    }
}

interface IStringifier {
    Stringify(js: IJsObject | IJsArray): string;
}

class Stringifier implements IStringifier {
    Stringify(js: IJsObject | IJsArray): string {
        if (js === undefined) return undefined;
        if (js === null) return 'null';

        let w = new Writer();
        js.Accept(w);

        return w.getText();
    }
}

function stringify(js: IJsObject | IJsArray): string {
    let s: IStringifier = new Stringifier();
    return s.Stringify(js);
}

export { Stringifier, IStringifier, stringify }