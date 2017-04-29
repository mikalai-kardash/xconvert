import { XDoc, XNode, XText, XComment, XAttribute } from './xdoc';

interface IParser {
    Parse(xmlContent: string): IXDoc;
}

namespace Symbols {
    export const NodeOpening = '<';
    export const NodeClosing = '>';

    export const Prolog = '?';
    export const Space  = ' ';
    export const Equal  = '=';
    export const DoubleQuote = '"';
    export const Exclamation = '!';

    export const ForwardSlash = '/';
    export const BackwardSlash = '\\';
}

namespace Expressions {
    export const NodeName = /\w/;    
}

interface IState {
    read(ch:string): void;
}

interface IStateManager {
    current: IState;
    switchTo(state: IState): void;

    jump(n: number): void;
}

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

class Value implements IState {
    
    constructor(
        public manager: IStateManager, 
        public prev: IState,
        public valueSetter: IValueSetter) { }

    temp: string = '';
    count: number = 0;

    read(ch: string): void {
        switch (ch) {
            case Symbols.DoubleQuote:
                this.count ++;
                if (this.count > 1) {
                    this.manager.switchTo(this.prev);
                    this.valueSetter.setValue(this.temp);
                    return;
                }
                break;
            
            default: {
                this.temp += ch;
            }
            break;
        }
    }
}

class Name implements IState {
    
    constructor(
        public manager: IStateManager, 
        public prev: IState,
        public nameSetter: INameSetter) { }

    temp: string = '';

    read(ch: string): void {
        switch (ch) {
            case Symbols.Equal:
                this.nameSetter.setName(this.temp);
                this.manager.switchTo(this.prev);
                this.prev.read(ch);
                break;
            
            default: {
                this.temp += ch;
            }
            break;
        }
    }
}

class AttributeExpression implements IState, INameSetter, IValueSetter {
    
    constructor(
        public manager: IStateManager, 
        public prev: IState,
        public attributeSetter: IAttributeAdder) { }

    name: string = '';
    value: string = '';

    read(ch: string): void {
        switch (ch) {
            case Symbols.Equal: {
                    let value = new Value(this.manager, this, this);
                    this.switchTo(value);
                }
                break;

            case Symbols.Space: {
                    this.switchBack();
                    this.prev.read(ch);
                }
                break;
           
            default:
                {
                    let name = new Name(this.manager, this, this);
                    this.switchTo(name);
                    name.read(ch);
                }
                break;
        }
    }

    switchBack(): void {
        this.attributeSetter.addAttribute(
            XAttribute.Get(this.name, this.value)
        );

        this.manager.switchTo(this.prev);
    }

    switchTo(state: IState): void {
        this.manager.switchTo(state);
    }

    setName(name: string): void {
        this.name = name;
    }

    setValue(value: string): void {
        this.value = value;
        this.switchBack();
    }
}

class PrologExpression implements IState, IAttributeAdder {

    constructor(
        public manager: IStateManager, 
        public prev: IState,
        public attributeAdder: IAttributeAdder) { }

    previousChar: string;
    attributes: IXAttribute[] = [];
    
    read(ch: string): void {

        switch (ch) {

            case Symbols.NodeClosing:
                if (this.previousChar === Symbols.Prolog) {
                    this.switchBack();
                }    
                return;

            case 'x':
            case 'm':
            case 'l':
                return;

            case Symbols.Prolog:
            case Symbols.Space:
                this.wait(ch);
                break;

            default:
                {
                    if (this.previousChar === Symbols.Space) {
                        this.previousChar = '';

                        let attribute = new AttributeExpression(this.manager, this, this);
                        this.switchTo(attribute);

                        attribute.read(ch);
                    } else {
                        this.wait(ch);
                    }
                }
                break;
        }
    }

    wait(ch: string): void {
        this.previousChar = ch;
    };

    addAttribute(attr: IXAttribute): void {
        this.attributes.push(attr);
    }

    switchTo(state:IState): void {
        this.manager.switchTo(state);
    }

    switchBack(): void {
        this.manager.switchTo(this.prev);
        this.attributes.forEach(a => { this.attributeAdder.addAttribute(a); });
    }
}

class TextExpression implements IState {
    constructor(
        public manager: IStateManager, 
        public prev: IState,
        public textAdder: ITextAdder) { }  

    text: string = '';

    read(ch: string): void {
        switch (ch) {
            case Symbols.NodeOpening:
                this.switchBack();
                this.prev.read(ch);
                break;

            default: {
                this.text += ch;
                }
                break;
        }    
    }

    switchBack(): void {
        this.manager.switchTo(this.prev);
        this.textAdder.addText(new XText(this.text));
    }    
}

class NodeExpression implements IState, IAttributeAdder, ITextAdder, INodeAdder, ICommentsAdder {
    
    constructor(
        public manager: IStateManager, 
        public prev: IState,
        public nodeAdder: INodeAdder) { }  

    attributes: IXAttribute[] = [];
    children: (IXNode | IXText | IXComment)[] = [];

    name: string = '';
    closingTag: string = '';
    previousChar: string = '';

    readingName: boolean = true;
    readingAttributes: boolean = false;
    readingContents: boolean = false;
    waitingForClosingTag: boolean = false;

    read(ch: string) {
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

    readName(ch: string): void {
        if (Expressions.NodeName.test(ch)) {
            this.name += ch;
        } else {
            this.readingName = false;
            this.readingAttributes = true;
        }
    }

    readAttributes(ch: string): void {
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

            default: {
                let attr = new AttributeExpression(this.manager, this, this);
                this.switchTo(attr);
                attr.read(ch);
            }
            break;
        }

    }

    readContents(ch: string): void {
        switch (ch) {
            case Symbols.NodeOpening:
                break;

            case Symbols.ForwardSlash:
                this.readingContents = false;
                this.waitingForClosingTag = true;
                break;
            
            default: {
                if (this.previousChar === Symbols.NodeOpening) {
                    if (ch === Symbols.Exclamation) {
                        let comment = new CommentExpression(this.manager, this, this);
                        this.manager.switchTo(comment);
                        this.manager.jump(2);
                    } else {
                        let node = new NodeExpression(this.manager, this, this);
                        this.switchTo(node);
                        node.read(ch);
                    }
                } else {
                    let text = new TextExpression(this.manager, this, this);
                    this.switchTo(text);
                    text.read(ch);
                }
            }
            break;
        }

        this.previousChar = ch;
    }

    waitForClosingTag(ch: string): void {
        this.closingTag += ch;

        if (this.closingTag === `/${this.name}>`) {
            this.switchBack();
        }
    }

    switchBack(): void {
        this.manager.switchTo(this.prev);

        let xNode: IXNode = new XNode(this.name);

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

    switchTo(state: IState): void {
        this.manager.switchTo(state);
    }

    addAttribute(attr: IXAttribute): void {
        this.attributes.push(attr);
    }

    addText(text: IXText): void {
        this.children.push(text);
    }

    addNode(node: IXNode): void {
        this.children.push(node);
    }

    addComments(comment: IXComment): void {
        this.children.push(comment);
    }
}

class CommentExpression implements IState {
    
    constructor(
        public manager: IStateManager, 
        public prev: IState,
        public commentsAdder: ICommentsAdder) { }

    sequence: string = '';

    read(ch: string): void {
        this.sequence += ch;

        if (this.endsWith('-->')) {
            this.switchBack();
        }
    }

    endsWith(s: string): boolean {
        if (this.sequence.length < s.length) {
            return false;
        }

        let end = this.sequence.substring(this.sequence.length - s.length);
        return end === s;
    }

    switchBack(): void {
        this.manager.switchTo(this.prev);

        let comment = this.sequence.substring(0, this.sequence.length - 3);

        this.commentsAdder.addComments(new XComment(comment));
        this.sequence = '';
    }
}

class Default implements IState, IAttributeAdder, INodeAdder, ICommentsAdder {

    constructor(
        public manager: IStateManager, 
        public prev: IState) { }

    previousChar: string;
    sequence: string = '';

    attributes: IXAttribute[] = [];
    nodes: IXNode[] = [];
    comments: IXComment[] = [];

    read(ch: string) {
        this.sequence += ch;

        switch (ch) {
            case Symbols.NodeOpening:
                //this.previousChar = ch;
                break;

            case Symbols.Prolog:
                if (this.previousChar === Symbols.NodeOpening) {
                    this.previousChar = '';
                    this.sequence = '';

                    let prolog = new PrologExpression(this.manager, this, this);
                    this.switchTo(prolog);
                }
                break;
            
            default: {
                if (this.previousChar === Symbols.NodeOpening && ch !== Symbols.ForwardSlash) {
                    let nodeName = Expressions.NodeName;
                    if (nodeName.test(ch)) {
                        this.previousChar = '';
                        this.sequence = '';

                        let node = new NodeExpression(this.manager, this, this);
                        this.switchTo(node);
                        node.read(ch);
                    }
                } else if (this.endsWith('<!--')) {
                    this.sequence = '';
                    let comment = new CommentExpression(this.manager, this, this);
                    this.switchTo(comment);
                }
            }
            break;
        }

        this.previousChar = ch;
    }

    addAttribute(attr: IXAttribute): void {
        this.attributes.push(attr);
    }

    addNode(node: IXNode): void {
        this.nodes.push(node);
    }

    addComments(comments: IXComment): void {
        this.comments.push(comments);
    }
    
    switchTo(state: IState): void {
        this.manager.switchTo(state);
    }

    endsWith(s: string): boolean {
        if (this.sequence.length < s.length) {
            return false;
        }

        let end = this.sequence.substring(this.sequence.length - s.length);
        return end === s;
    }
}

class Parser implements IParser, IStateManager {
    current: IState;
    position: number = 0;

    switchTo(state: IState): void {
        this.current = state;
    }

    read(ch: string): void {
        this.current.read(ch);
    }

    jump(n: number): void {
        this.position += n;
    }

    Parse(xmlContent: string): IXDoc {
        let d = new Default(this, null);

        this.switchTo(d);
        this.position = 0;

        for(; this.position < xmlContent.length; this.position++) {
            let ch = xmlContent[this.position];
            this.read(ch);
        }

        let xDoc: IXDoc = new XDoc();
        let attrs = d.attributes;
        
        attrs.forEach((a) => {
            switch (a.Name) {
                case 'version':
                    xDoc.Version = a.Value;
                    break;
            }
        });

        if (d.nodes.length !== 0) {
            xDoc.Root = d.nodes[0];
        }

        let comments = d.comments;
        if (comments.length > 0) {
            xDoc.Comments = [];
            comments.forEach((c) => {
                xDoc.Comments.push(c);
            });
        }

        return xDoc;
    }
}

export {
    IAttributeAdder,
    ICommentsAdder,
    INameSetter,
    INodeAdder,
    IParser,
    IState,
    IStateManager,
    ITextAdder,
    IValueSetter,
    
    AttributeExpression,
    CommentExpression,
    Name, 
    NodeExpression,
    PrologExpression,
    Parser,
    TextExpression,
    Value
}