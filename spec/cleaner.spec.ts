import { clean } from '../src/cleaner';
import { XDoc, XNode, XAttribute, XComment, XText } from '../src/xdoc';

let findAttr: (node: IXNode, name: string) => IXAttribute = (n, name) => {
    return n.Attributes.find((a) => {
        return a.Name === name;
    });
};

let findNode: (node: IXNode, name: string) => IXNode = (n, name) => {
    return <IXNode>n.Children.find((n) => {
        if ((<IXNode>n).Children) {
            return (<IXNode>n).Name === name;
        }
        return false;
    });
};

let findText: (text: IXNode, name: string) => IXText = (t, name) => {
    return <IXText>t.Children.find((n) => {
        return (<IXText>n).Text === name;
    });
};

let findAnyComment: (text: IXNode) => IXComment = (t) => {
    return <IXComment>t.Children.find((n) => {
        let c = (<IXComment>n).Comment;
        return c !== null && c !== undefined;
    });
};

let log = (obj) => {
    console.log(JSON.stringify(obj, null, 4));
};

describe('xml dom cleaner', () => {

    describe('empty document', () => {
        let xml: IXDoc;

        beforeEach(() => {
            let before: IXDoc = new XDoc();
            xml = clean(before);
        });

        it('not null', () => {
            expect(xml).toBeDefined();
            expect(xml).not.toBeNull();
        });

        it('has no version', () => {
            expect(xml.Version).toEqual('');
        });

        it('has no encoding', () => {
            expect(xml.Encoding).toEqual('');
        });

        it('has no comments', () => {
            expect(xml.Comments.length).toEqual(0);
        });
    });

    describe('empty documents with attributes', () => {
        let xml: IXDoc;

        beforeEach(() => {
            let before: IXDoc = new XDoc();

            before.Version = '1.0';
            before.Encoding = 'utf-8';
            before.Comments = [
                new XComment("some comment")
            ];

            xml = clean(before);
        });

        it('not null', () => {
            expect(xml).toBeDefined();
            expect(xml).not.toBeNull();
        });

        it('has version', () => {
            expect(xml.Version).toEqual('1.0');
        });

        it('has encoding', () => {
            expect(xml.Encoding).toEqual('utf-8');
        });

        it('has not comments', () => {
            expect(xml.Comments.length).toEqual(0);
        });

    });

    describe('document with root', () => {
        let xml: IXDoc;

        beforeEach(() => {
            let before: IXDoc = new XDoc();
            let root: IXNode = new XNode('packages');

            root.Attributes = [
                XAttribute.Get('quantity', '25'),
                XAttribute.Get('empty', ''),
                XAttribute.Get('truncated', ' \r what? \t '),
                XAttribute.Get('nothing', ' \r \t \n '),
                XAttribute.Get('', 'nameless')
            ];

            before.Root = root;

            xml = clean(before);
        });

        it('has root', () => {
            expect(xml.Root).not.toBeNull();
        });

        it('has correct root name', () => {
            expect(xml.Root.Name).toEqual('packages');
        });

        it('has attributes', () => {
            expect(xml.Root.Attributes.length).toBeGreaterThan(0);
        });

        it('has quantity attribute', () => {
            let quantity = findAttr(xml.Root, 'quantity');
            expect(quantity).toBeDefined();
            expect(quantity).not.toBeNull();
        });

        it('has quantity attribute value set', () => {
            let quantity = findAttr(xml.Root, 'quantity');
            expect(quantity.Value).toEqual('25');
        });

        it('DOES NOT have empty attribute', () => {
            let empty = findAttr(xml.Root, 'empty');
            expect(empty).toBeUndefined();
        });

        it('remove space-like symbols from truncated attribute', () => {
            let truncated = findAttr(xml.Root, 'truncated');
            expect(truncated.Value).toEqual('what?')
        });

        it('DOES NOT have attributes that has nothing but space-like characters in value', () => {
            let n = findAttr(xml.Root, 'nothing');
            expect(n).toBeUndefined();
        });

        it('DOES NOT have unnamed attributes', () => {
            let n = findAttr(xml.Root, '');
            expect(n).toBeUndefined();
        });
    });

    describe('root with subnodes', () => {
        let xml: IXDoc;

        beforeEach(() => {
            let before: IXDoc = new XDoc();
            let root: IXNode = new XNode('packages');
            before.Root = root;

            let unity = new XNode('package');

            unity.Attributes = [
                XAttribute.Get('name', 'unity'),
                XAttribute.Get('version', '3.5'),
                XAttribute.Get('empty', '')
            ];

            root.Children = [
                unity,
                new XComment('this is a comment'),
                new XNode('empty'),
                new XNode(''),
                new XText(''),
                new XText('   some text   '),
                new XText(' \r \n \t')
            ];

            xml = clean(before);
        });

        it('not null', () => {
            expect(xml).not.toBeNull();
            expect(xml).toBeDefined();
        });

        it('has a root', () => {
            expect(xml.Root).not.toBeNull();
            expect(xml.Root).toBeDefined();
        });

        it('has unity node', () => {
            let unity = findNode(xml.Root, 'package');

            expect(unity).toBeDefined();
            expect(unity).not.toBeNull();
        });

        it('unity has no children', () => {
            let unity = findNode(xml.Root, 'package');
            expect(unity.Children.length).toEqual(0);
        });

        it('unity has attributes', () => {
            let unity = findNode(xml.Root, 'package');
            expect(unity.Attributes.length).toEqual(2);
        });

        it('unity name attribute is set', () => {
            let unity = findNode(xml.Root, 'package');
            let name = findAttr(unity, 'name');

            expect(name).toBeDefined();
            expect(name).not.toBeNull();
            expect(name.Value).toEqual('unity');
        });

        it('unity version attribute is set', () => {
            let unity = findNode(xml.Root, 'package');
            let version = findAttr(unity, 'version');

            expect(version).toBeDefined();
            expect(version).not.toBeNull();
            expect(version.Value).toEqual('3.5');
        });

        it('unity DOES NOT have empty attribute', () => {
            let unity = findNode(xml.Root, 'package');
            let empty = findAttr(unity, 'empty');
            expect(empty).toBeUndefined();
        });

        it('have empty node', () => {
            let empty = findNode(xml.Root, 'empty');
            expect(empty).toBeDefined();
            expect(empty).not.toBeNull();
        });

        it('empty node has no attributes', () => {
            let empty = findNode(xml.Root, 'empty');
            expect(empty.Attributes.length).toEqual(0);
        });

        it('empty node has no children', () => {
            let empty = findNode(xml.Root, 'empty');
            expect(empty.Children.length).toEqual(0);
        });

        it('DOES NOT have nameless node', () => {
            let nameless = findNode(xml.Root, '');
            expect(nameless).toBeUndefined();
        });

        it('has text node', () => {
            let t = findText(xml.Root, 'some text');
            expect(t).toBeDefined();
            expect(t).not.toBeNull();
        });

        it('DOES NOT have empty text nodes', () => {
            let t = findText(xml.Root, '');
            expect(t).toBeUndefined();
        });

        it('DOES NOT have comments', () => {
            let comment = findAnyComment(xml.Root);
            expect(comment).toBeUndefined();
        });

    });

});