import { IWriter } from "./writer";

class JsPropertyVisitor {
    constructor(
        private writer: IWriter,
        private visitor: IJsVisitor) {}

    public visit(prop: IJsProperty): void {
        this.writer.startPropertyName();
        this.writer.append(prop.name);
        this.writer.endPropertyName();

        this.writer.appendPropertyEqual();

        if ((prop.value as string).length) {
            this.writer.startStrignValue();
            this.writer.append(prop.value as string);
            this.writer.endStrignValue();
            return;
        }

        if ((prop.value as IJsObject).properties) {
            const o = prop.value as IJsObject;
            o.Accept(this.visitor);
            return;
        }

        if ((prop.value as IJsArray).children) {
            const a = prop.value as IJsArray;
            a.Accept(this.visitor);
            return;
        }
    }
}

export default JsPropertyVisitor;
