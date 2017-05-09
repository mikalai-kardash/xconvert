import { IXAttribute, IXComment, IXDoc, IXNode, IXText } from "../../xml/schema";

interface INameSetter {
    setName(name: string): void;
}

interface IValueSetter {
    setValue(value: string): void;
}

interface IAttributeAdder {
    addAttribute(attr: IXAttribute): void;
}

interface INodeAdder {
    addNode(node: IXNode): void;
}

interface ITextAdder {
    addText(text: IXText): void;
}

interface ICommentsAdder {
    addComments(comments: IXComment): void;
}

export {
    INameSetter,
    IValueSetter,
    IAttributeAdder,
    INodeAdder,
    ITextAdder,
    ICommentsAdder,
};
