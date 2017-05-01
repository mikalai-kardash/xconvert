class TestCommentsAdder implements ICommentsAdder {
    public comment: IXComment;

    public addComments(comment: IXComment): void {
        this.comment = comment;
    }
}

export default TestCommentsAdder;
