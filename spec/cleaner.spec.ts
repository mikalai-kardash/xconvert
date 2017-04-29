import { clean } from '../src/cleaner';
import { XDoc, XNode, XAttribute } from '../src/xdoc';

let findAttr: (node: IXNode, name: string) => IXAttribute = (n, name) => {
    return n.Attributes.find((a) => {
        return a.Name === name;
    });
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

});