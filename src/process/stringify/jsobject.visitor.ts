import { IWriter } from "./writer";

class JsObjectVisitor {
    constructor(
        private writer: IWriter,
        private visitor: IJsVisitor) {}

    public visit(obj: IJsObject): void {
        this.writer.beginObject();

        obj.properties.forEach((p, i) => {
            if (i > 0) {
                this.writer.appendPropertySeparator();
            }
            p.Accept(this.visitor);
        });

        this.writer.endObject();
    }
}

export default JsObjectVisitor;
