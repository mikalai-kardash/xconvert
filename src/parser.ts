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
        this.attributeSetter.addAttribute({
            Name: this.name,
            Value: this.value
        });

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
                break;

            default: {
                this.text += ch;
                }
                break;
        }    
    }

    switchBack(): void {
        this.manager.switchTo(this.prev);
        this.textAdder.addText({
            Text: this.text
        })
    }    
}

class NodeExpression implements IState, IAttributeAdder, ITextAdder {
    
    constructor(
        public manager: IStateManager, 
        public prev: IState,
        public nodeAdder: INodeAdder) { }  

    attributes: IXAttribute[] = [];
    children: (IXNode | IXText)[] = [];

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
                this.readingContents = false;
                this.waitingForClosingTag = true;                
                break;
            
            default: {
                let text = new TextExpression(this.manager, this, this);
                this.switchTo(text);
                text.read(ch);
            }
            break;
        }

    }

    waitForClosingTag(ch: string): void {
        this.closingTag += ch;

        if (this.closingTag === `</${this.name}>`) {
            this.switchBack();
        }
    }

    switchBack(): void {
        this.manager.switchTo(this.prev);

        let xNode: IXNode = {
            Name: this.name
        };

        if (this.attributes) {
            xNode.Attributes = [];
        }

        this.attributes.forEach((a) => {
            xNode.Attributes.push(a);
        });

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
}

class Default implements IState, IAttributeAdder, INodeAdder {

    constructor(
        public manager: IStateManager, 
        public prev: IState) { }    

    previousChar: string;

    attributes: IXAttribute[] = [];
    nodes: IXNode[] = [];

    read(ch: string) {
        switch (ch) {
            case Symbols.NodeOpening:
                this.wait(ch);
                break;

            case Symbols.Prolog:
                if (this.previousChar === Symbols.NodeOpening) {
                    this.previousChar = '';

                    this.manager.switchTo(new PrologExpression(this.manager, this, this));
                }
                break;
            
            default: {
                if (this.previousChar === Symbols.NodeOpening) {
                    let nameSymbol = /\w/;
                    if (nameSymbol.test(ch)) {
                        
                        this.previousChar = '';
                        let node = new NodeExpression(this.manager, this, this);
                        this.switchTo(node);
                        node.read(ch);
                    }
                }
            }
            break;
        }
    }

    wait(ch: string) {
        this.previousChar = ch;
    };

    addAttribute(attr: IXAttribute): void {
        this.attributes.push(attr);
    }

    addNode(node: IXNode): void {
        this.nodes.push(node);
    }
    
    switchTo(state: IState): void {
        this.manager.switchTo(state);
    }
}

class Parser implements IParser, IStateManager {
    current: IState;

    switchTo(state: IState): void {
        this.current = state;
    }

    read(ch: string) {
        this.current.read(ch);
    }

    Parse(xmlContent: string): IXDoc {
        let d = new Default(this, null);

        this.switchTo(d);

        for(let i = 0; i < xmlContent.length; i++) {
            this.read(xmlContent[i]);
        }

        let xDoc: IXDoc = { Version: '', Root: null };
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

        return xDoc;
    }
}

export {
    IAttributeAdder,
    INameSetter,
    INodeAdder,
    IParser,
    IState,
    IStateManager,
    ITextAdder,
    IValueSetter,
    
    AttributeExpression,
    Name, 
    NodeExpression,
    PrologExpression,
    Parser,
    TextExpression,
    Value
}