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
    ITextAdder
} from '../src/parser';

import { readFile } from './reader';
import { SpecConfiguration } from './spec.config';

let config = new SpecConfiguration();

class TestStateManager implements IStateManager {
    current: IState;

    switchTo(state: IState): void {
        this.current = state;
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

let run = (manager: IStateManager, input: string) => {
    let i = 0;
    for(; i < input.length; i++) {
        manager.current.read(input[i]);
    }
};

describe("parser", () => { 

    describe('simple documents', () => {

        describe('single-noded document', () => {
            let parser = new Parser();
            let xml: IXDoc;

            beforeEach((done) => {
                readFile(config.GetInput('simple/1')).then((content) => {
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
                expect(r.Children).toBeFalsy();
            })
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

        it ('sets text when switching back to previous state', () => {
            run(manager, 'all text<');
            expect(ta.text).toBeTruthy();
            expect(ta.text.Text).toEqual('all text');
        });
    });
});