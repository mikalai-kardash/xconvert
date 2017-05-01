import XNode from "../../../xml/xnode";
import * as Expressions from "../expressions";
import * as Symbols from "../symbols";
import AttributeExpression from "./attribue.expression";
import CommentExpression from "./comment.expression";
import TextExpression from "./text.expression";

class NodeExpression implements IState, IAttributeAdder, ITextAdder, INodeAdder, ICommentsAdder {
    public attributes: IXAttribute[] = [];
    public children: Array<IXNode | IXText | IXComment> = [];
    public name: string = "";
    public closingTag: string = "";
    public previousChar: string = "";
    public readingName: boolean = true;
    public readingAttributes: boolean = false;
    public readingContents: boolean = false;
    public waitingForClosingTag: boolean = false;

    constructor(
        public manager: IStateManager,
        public prev: IState,
        public nodeAdder: INodeAdder) { }

    public read(ch: string) {
        if (this.readingName) {
            this.readName(ch);
        }

        if (this.readingAttributes) {
            this.readAttributes(ch);
            return;
        }

        if (this.readingContents) {
            this.readContents(ch);
        }

        if (this.waitingForClosingTag) {
            this.waitForClosingTag(ch);
        }
    }

    public readName(ch: string): void {
        if (Expressions.NodeName.test(ch)) {
            this.name += ch;
        } else {
            this.readingName = false;
            this.readingAttributes = true;
        }
    }

    public readAttributes(ch: string): void {
        switch (ch) {
            case Symbols.NodeClosing:
                this.readingAttributes = false;

                if (this.previousChar === Symbols.ForwardSlash) {
                    this.switchBack();
                    return;
                }

                this.readingContents = true;
                break;

            case Symbols.Space:
                break;

            case Symbols.ForwardSlash:
                this.previousChar = ch;
                break;

            default:
                const attr = new AttributeExpression(this.manager, this, this);
                this.switchTo(attr);
                attr.read(ch);
                break;
        }

    }

    public readContents(ch: string): void {
        switch (ch) {
            case Symbols.NodeOpening:
                break;

            case Symbols.ForwardSlash:
                this.readingContents = false;
                this.waitingForClosingTag = true;
                break;

            default:
                if (this.previousChar === Symbols.NodeOpening) {
                    if (ch === Symbols.Exclamation) {
                        const comment = new CommentExpression(this.manager, this, this);
                        this.manager.switchTo(comment);
                        this.manager.jump(2);
                    } else {
                        const node = new NodeExpression(this.manager, this, this);
                        this.switchTo(node);
                        node.read(ch);
                    }
                } else {
                    const text = new TextExpression(this.manager, this, this);
                    this.switchTo(text);
                    text.read(ch);
                }
                break;
        }

        this.previousChar = ch;
    }

    public waitForClosingTag(ch: string): void {
        this.closingTag += ch;

        if (this.closingTag === `/${this.name}>`) {
            this.switchBack();
        }
    }

    public switchBack(): void {
        this.manager.switchTo(this.prev);

        const xNode: IXNode = new XNode(this.name);

        if (this.attributes.length > 0) {
            xNode.Attributes = [];

            this.attributes.forEach((a) => {
                xNode.Attributes.push(a);
            });
        }

        if (this.children.length > 0) {
            xNode.Children = [];

            this.children.forEach((c) => {
                xNode.Children.push(c);
            });
        }

        this.nodeAdder.addNode(xNode);
    }

    public switchTo(state: IState): void {
        this.manager.switchTo(state);
    }

    public addAttribute(attr: IXAttribute): void {
        this.attributes.push(attr);
    }

    public addText(text: IXText): void {
        this.children.push(text);
    }

    public addNode(node: IXNode): void {
        this.children.push(node);
    }

    public addComments(comment: IXComment): void {
        this.children.push(comment);
    }
}

export default NodeExpression;
