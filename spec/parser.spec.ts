import { 
    Parser, 
    Name, 
    IStateManager, 
    IState, 
    IAttributeAdder, 
    INameSetter, 
    INodeAdder,
    Value, 
    IValueSetter, 
    AttributeExpression, 
    PrologExpression,
    TextExpression,
    NodeExpression,
    ITextAdder,
    CommentExpression,
    ICommentsAdder
} from '../src/parser';

import { readFile } from './reader';
import { SpecConfiguration } from './spec.config';

let config = new SpecConfiguration();

class TestStateManager implements IStateManager {
    current: IState;
    position: number = 0;

    switchTo(state: IState): void {
        this.current = state;
    }

    parse(input: string): void {
        this.position = 0;
        for(; this.position < input.length; this.position++) {
            let ch = input[this.position];
            this.current.read(ch);
        }
    }

    jump(n: number): void {
        this.position += n;
    }
}

class TestState implements IState {
    temp = '';

    read(ch: string): void {
        this.temp += ch;
    }
}

class TestNameSetter implements INameSetter {
    name = '';

    setName(name: string): void {
        this.name = name;
    }
}

class TestValueSetter implements IValueSetter {
    value: string;

    setValue(value: string): void {
        this.value = value;
    }    
}

class TestAttributeAdder implements IAttributeAdder {
    attr: IXAttribute;
    all: IXAttribute[] = [];

    addAttribute(attr: IXAttribute): void {
        this.attr = attr;
        this.all.push(attr);
    }
}

class TestNodeAdder implements INodeAdder {
    node: IXNode;

    addNode(node: IXNode): void {
        this.node = node;
    }
}

class TestTextAdder implements ITextAdder {
    text: IXText;

    addText(text: IXText): void {
        this.text = text;
    }
}

class TestCommentsAdder implements ICommentsAdder {
    comment: IXComment;

    addComments(comment: IXComment): void {
        this.comment = comment;
    }
}

let run = (manager: TestStateManager, input: string) => {
    manager.parse(input);
};

interface DoneXml {
    (xml: IXDoc): void;
}

describe("parser", () => { 

    describe('simple documents', () => {

        let read = (name: string, done: DoneFn, doneXml: DoneXml) => {
            readFile(config.GetInput(`simple/${name}`)).then((content) => {
                let parser = new Parser();
                let xml = parser.Parse(content);

                doneXml(xml);
                done();
            }, () => {});            
        };

        describe('single-noded document', () => {
            let xml: IXDoc;

            beforeEach((done) => {
                readFile(config.GetInput('simple/1')).then((content) => {
                    let parser = new Parser();
                    xml = parser.Parse(content);

                    done();
                }, () => {});
            });

            it('document is not null', () => {
                expect(xml).not.toBeNull();
            });

            it('version is read correctly', () => {
                expect(xml.Version).toEqual('1.0');
            });

            it('has a root', () => {
                expect(xml.Root).not.toBeNull();
                expect(xml.Root).toBeDefined();

                let r = xml.Root;
                expect(r.Name).toEqual('node');
            })
        });

        describe('xml document with comment', () => {
            let xml: IXDoc;

            beforeEach((done) => {
                readFile(config.GetInput('simple/2')).then((content) => {
                    let parser = new Parser();
                    xml = parser.Parse(content);

                    done();
                }, () => {});
            });

            it('should have encoding attribute', () => {
                expect(xml.Encoding).toEqual('utf-8');
            });

            it('should have comment', () => {
                expect(xml.Comments.length).toEqual(1);
            });

            it('should read comment value', () => {
                expect(xml.Comments[0].Comment).toContain('this is a comment');
            });
        });

        describe('xml document with text, subnode and comments', () => {
            let xml: IXDoc;
            
            beforeEach((done) => {
                read("3", done, (xDoc) => { xml = xDoc; });
            });

            it('has root', () => {
                expect(xml.Root).toBeDefined();
                expect(xml.Root).not.toBeNull();
            });

            it('root has a name', () => {
                expect(xml.Root.Name).toEqual('root');
            })

            it('root has children', () => {
                expect(xml.Root.Children.length).toBeGreaterThanOrEqual(4);
            });

            let findComment: (text: string) => IXComment = (text: string) => {
                return <IXComment>xml.Root.Children.find((i) => {
                    let c = <IXComment>i;
                    return (!!c.Comment) && c.Comment.includes(text);
                });
            };

            let findText: (text: string) => IXText = (text: string) => {
                return <IXText>xml.Root.Children.find((i) => {
                    let c = <IXText>i;
                    return (!!c.Text) && c.Text.includes(text);
                });
            };

            let findNode: (text: string) => IXNode = (text: string) => {
                return <IXNode>xml.Root.Children.find((i) => {
                    let c = <IXNode>i;
                    return (!!c.Name) && c.Name.includes(text);
                });
            };

            it('root has footer comment', () => {
                let found = findComment("FOOTER");
                expect(found).not.toBeNull();
                expect(found).toBeDefined();
            });

            it('root has header comment', () => {
                let found = findComment("HEADER");
                expect(found).not.toBeNull();
                expect(found).toBeDefined();
            });

            it('root has sub-node', () => {
                let found = findNode('item');
                expect(found).not.toBeNull();
                expect(found).toBeDefined();
            });

            it('root has inner text', () => {
                let found = findText('some text');
                expect(found).not.toBeNull();
                expect(found).toBeDefined();
            });
        });
    });

    describe('Name state', () => {
        let manager : TestStateManager;
        let prev: TestState;
        let ns : TestNameSetter;
        let name : Name;

        beforeEach(() => {
            manager = new TestStateManager();
            prev = new TestState();
            ns = new TestNameSetter();
            name = new Name(manager, prev, ns);

            manager.switchTo(name);
        });

        it('reads everything before \'=\' sign', () => {
            run(manager, 'abc=');

            expect(ns.name).toEqual('abc');
        });

        it('pushes \'=\' sign to previous state', () => {
            run(manager, 'abc=');
            expect(prev.temp).toEqual('=');            
        });

        it('switches back to previous state after reaching \'=\' sign', () => {
            run(manager, 'abc=');
            expect(manager.current).toBe(prev);            
        });

        it('switches to previous state once \'=\' sign is reached', () => {
            run(manager, 'abc=xyz');

            expect(prev.temp).toContain('xyz');
        });
    });

    describe('Value state', () => {
        let manager: TestStateManager;
        let prev: TestState;
        let value: Value;
        let vs: TestValueSetter;

        beforeEach(() => {
            manager = new TestStateManager();
            prev = new TestState();
            vs = new TestValueSetter();
            value = new Value(manager, prev, vs);

            manager.switchTo(value);
        });

        it('reads value between "\'s', () => {
            run(manager, '"abc"');
            expect(vs.value).toEqual('abc');
        });

        it('switched back to previous state after second " symbol', () => {
            run(manager, '"abc"');
            expect(manager.current).toBe(prev);
        });

        it('it switched back to previous state right after second " symbol', () => {
            run(manager, '"abc" xyz');
            expect(vs.value).toEqual('abc');
            expect(prev.temp).toEqual(' xyz');
        });
    });

    describe('AttributeExpression', () => {
        let attr: AttributeExpression;
        let manager: TestStateManager;
        let prev: TestState;
        let ats: TestAttributeAdder;


        beforeEach(() => {
            manager = new TestStateManager();
            prev = new TestState();
            ats = new TestAttributeAdder();
            attr = new AttributeExpression(manager, prev, ats);

            manager.switchTo(attr);
        });

        it('reads attribute name', () => {
            run(manager, 'abc="xyz"');
            expect(attr.name).toEqual('abc');
        });

        it('reads attribute name (with prefix)', () => {
            run(manager, 'xmlns:h="http://www.w3.org/TR/html4/"');
            expect(attr.name).toEqual('xmlns:h');
        });

        it('reads attribute value', () => {
            run(manager, 'abc="xyz"');
            expect(attr.value).toEqual('xyz');
        });

        it('switches back to previous state after reading value', () => {
            run(manager, 'abc="xyz"');
            expect(manager.current).toBe(prev);
        });

        it('switches back to previoius state after reading \' \' symbol', () => {
            run(manager, 'abc="xyz" ');
            expect(manager.current).toBe(prev);
        });

        it('sends \' \' symbol to previous state', () => {
            run(manager, 'abc="xyz" ');
            expect(prev.temp).toEqual(' ');
        });

        it('understand single quotes as well', () => {
            run(manager, 'abc=\'xyz\'');
            expect(attr.value).toEqual('xyz');
        });

        it('read value within single quotes properly', () => {
            run(manager, 'abc=\'this "is" value\'');
            expect(attr.value).toEqual('this "is" value');
        });

        it('reads value within double quotes properly', () => {
            run(manager, 'abc="this \'is\' value"');
            expect(attr.value).toEqual("this 'is' value");
        });
    });

    describe('PrologExpression', () => {
        let prolog: PrologExpression;
        let prev: TestState;
        let manager: TestStateManager;
        let aa: TestAttributeAdder;

        beforeEach(() => {
            prev = new TestState();
            manager = new TestStateManager();
            aa = new TestAttributeAdder();
            prolog = new PrologExpression(manager, prev, aa);

            manager.switchTo(prolog);
        });

        it('reads version', () => {
            run(manager, '?xml version="1.0"');

            expect(prolog.attributes.length).toEqual(1);

            let attr = prolog.attributes[0];
            expect(attr.Name).toEqual('version');
            expect(attr.Value).toEqual('1.0');
        });

        it('reads encoding', () => {
            run(manager, '?xml version="1.0" encoding="UTF-8"');

            expect(prolog.attributes.length).toEqual(2);

            let attr = prolog.attributes[1];
            expect(attr.Name).toEqual('encoding');
            expect(attr.Value).toEqual('UTF-8');
        });

        it('switches back to previous state after closing symbol', () => {
            run(manager, '?xml version="1.0" ?>');
            expect(manager.current).toBe(prev);
        });

        it('sets all attributes after switching to previous state', () => {
            run(manager, '?xml version="1.0" encoding="UTF-8"?>');
            expect(aa.all.length).toEqual(2);
        });
    });

    describe('NodeExpression', () => {
        let node: NodeExpression;
        let manager: TestStateManager;
        let prev: TestState;
        let na: TestNodeAdder;

        beforeEach(() => {
            prev = new TestState();
            manager = new TestStateManager();
            na = new TestNodeAdder();
            node = new NodeExpression(manager, prev, na);

            manager.switchTo(node);
        });

        it('reads node name', () => {
            run(manager, 'name></name>');
            expect(node.name).toEqual('name');
        });

        it('reads node name (with prefix)', () => {
            run(manager, 'h:name></h:name>');
            expect(node.name).toEqual('h:name');
        });

        it('reads node name (with _)', () => {
            run(manager, '_name></_name>');
            expect(node.name).toEqual('_name');
        });

        it('reads node name (with digits)', () => {
            run(manager, 'n9m3></n9m3>');
            expect(node.name).toEqual('n9m3');
        });

        it('reads node name (with hyphen)', () => {
            run(manager, 'first-name></first-name>');
            expect(node.name).toEqual('first-name');
        });

        it('reads node name (with .)', () => {
            run(manager, 'first.name></first.name>');
            expect(node.name).toEqual('first.name');
        });

        it('switches back to previous state after closing tag', () => {
            run(manager, 'name></name>');
            expect(manager.current).toEqual(prev);
        });

        it('switches back to previous state for self-closing tag', () => {
            run(manager, 'name />');
            expect(manager.current).toEqual(prev);
        });

        it('sets node value when switching back', () => {
            run(manager, 'name abc="xyz" />');

            expect(na.node).toBeTruthy();

            let n = na.node;
            expect(n.Name).toEqual('name');
            expect(n.Attributes).toBeTruthy();
            expect(n.Attributes.length).toEqual(1);

            let a = n.Attributes[0];
            expect(a.Name).toEqual('abc');
            expect(a.Value).toEqual('xyz');
        })

        it('reads attribute', () => {
            run(manager, 'name abc="xyz"></name>');

            expect(node.attributes.length).toEqual(1);
            
            let attr = node.attributes[0];
            expect(attr.Name).toEqual('abc');
            expect(attr.Value).toEqual('xyz');
        });

        it('reads text content', () => {
            run(manager, 'name>text</name>');
            expect(node.children.length).toEqual(1);
            expect((<IXText>node.children[0]).Text).toEqual('text');
        });

        it('reads subnodes', () => {
            run(manager, 'name><node/></name>');
            expect(node.children.length).toEqual(1);
            expect((<IXNode>node.children[0]).Name).toEqual('node');
        });

        it('reads comment tag', () => {
            run(manager, 'name><!-- comment --></name>');
            expect(node.children.length).toEqual(1);
        });

        it('reads comment tag text', () => {
            run(manager, 'name><!-- comment --></name>');
            let comment = <IXComment>node.children[0];
            expect(comment.Comment).toContain('comment');
        });
    });

    describe('TextExpression', () => {
        let text: TextExpression;
        let manager: TestStateManager;
        let prev: TestState;
        let ta: TestTextAdder;

        beforeEach(() => {
            prev = new TestState();
            manager = new TestStateManager();
            ta = new TestTextAdder();
            text = new TextExpression(manager, prev, ta);

            manager.switchTo(text);
        });

        it('reads all text', () => {
            run(manager, 'all text');
            expect(text.text).toEqual('all text');
        });

        it('switches back when found \'<\' symbol', () => {
            run(manager, 'all text<');
            expect(manager.current).toEqual(prev);            
        });

        it('sets text when switching back to previous state', () => {
            run(manager, 'all text<');
            expect(ta.text).toBeTruthy();
            expect(ta.text.Text).toEqual('all text');
        });
    });

    describe('CommentExpression', () => {
        let comment: CommentExpression;
        let manager: TestStateManager;
        let prev: TestState;
        let ca: TestCommentsAdder;

        beforeEach(() => {
            prev = new TestState();
            ca = new TestCommentsAdder();
            manager = new TestStateManager();
            comment = new CommentExpression(manager, prev, ca);

            manager.switchTo(comment);
        });

        it('reads comment', () => {
            run(manager, 'comment -->');
            expect(ca.comment).toBeDefined();
        });

        it('reads comment text correctly', () => {
            run(manager, 'comment -->');
            expect(ca.comment.Comment).toEqual('comment ');
        });

        it('switches back to previous state after reaching comment end', () => {
            run(manager, 'comment -->');
            expect(manager.current).toBe(prev);
        });
    });
});