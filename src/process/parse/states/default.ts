import { IXAttribute, IXComment, IXNode } from "../../../xml/schema";
import * as Expressions from "../expressions";
import { IAttributeAdder, ICommentsAdder, INodeAdder } from "../setters";
import { IState, IStateManager } from "../states";
import * as Symbols from "../symbols";
import CommentExpression from "./comment.expression";
import NodeExpression from "./node.expression";
import PrologExpression from "./prolog";

class Default implements IState, IAttributeAdder, INodeAdder, ICommentsAdder {
    public previousChar: string;
    public sequence: string = "";
    public attributes: IXAttribute[] = [];
    public nodes: IXNode[] = [];
    public comments: IXComment[] = [];

    constructor(
        public manager: IStateManager,
        public prev: IState) { }

    public read(ch: string) {
        this.sequence += ch;

        switch (ch) {
            case Symbols.NodeOpening:
                break;

            case Symbols.Prolog:
                if (this.previousChar === Symbols.NodeOpening) {
                    this.previousChar = "";
                    this.sequence = "";

                    const prolog = new PrologExpression(this.manager, this, this);
                    this.switchTo(prolog);
                }
                break;

            default:
                if (this.previousChar === Symbols.NodeOpening && ch !== Symbols.ForwardSlash) {
                    const nodeName = Expressions.NodeName;
                    if (nodeName.test(ch)) {
                        this.previousChar = "";
                        this.sequence = "";

                        const node = new NodeExpression(this.manager, this, this);
                        this.switchTo(node);
                        node.read(ch);
                    }
                } else if (this.endsWith("<!--")) {
                    this.sequence = "";
                    const comment = new CommentExpression(this.manager, this, this);
                    this.switchTo(comment);
                }
                break;
        }

        this.previousChar = ch;
    }

    public addAttribute(attr: IXAttribute): void {
        this.attributes.push(attr);
    }

    public addNode(node: IXNode): void {
        this.nodes.push(node);
    }

    public addComments(comments: IXComment): void {
        this.comments.push(comments);
    }

    public switchTo(state: IState): void {
        this.manager.switchTo(state);
    }

    public endsWith(s: string): boolean {
        if (this.sequence.length < s.length) {
            return false;
        }

        const end = this.sequence.substring(this.sequence.length - s.length);
        return end === s;
    }
}

export default Default;
