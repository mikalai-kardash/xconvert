import { ICommentsAdder } from "../../lib/process/parse/setters";
import { IXComment } from "../../lib/xml/schema";

class TestCommentsAdder implements ICommentsAdder {
    public comment: IXComment;

    public addComments(comment: IXComment): void {
        this.comment = comment;
    }
}

export default TestCommentsAdder;
