import { IWriter } from "./writer";

class JsArrayVisitor {
    constructor(
        private writer: IWriter,
        private visitor: IJsVisitor) {}

    public visit(arr: IJsArray): void {
        this.writer.startArray();

        arr.children.forEach((c, i) => {

            if (i > 0) {
                this.writer.appendArrayItemSeparator();
            }

            if ((c as string).length) {
                this.writer.startStrignValue();
                this.writer.append(c as string);
                this.writer.endStrignValue();
                return;
            }

            if ((c as IJsObject).properties) {

                const o = c as IJsObject;
                o.Accept(this.visitor);
                return;
            }

        });

        this.writer.endArray();
    }
}

export default JsArrayVisitor;
