import {
    IConverter,
    Converter
} from '../src/converter';

import { XNode, XDoc, XText, XAttribute } from '../src/xdoc';

import * as util from 'util';

let log = (obj) => {
    console.log(JSON.stringify(obj, null, 4));
};

let findProp: (obj: IJsObject, name: string) => IJsProperty = (o, n) => {
    return o.properties.find((p) => {
        return p.name === n;
    });
};

let expectProp: (obj:IJsObject, name: string) => void = (o, n) => {
    let p = findProp(o, n);
    expect(p).toBeDefined();
    expect(p).not.toBeNull();
    expect(p.name).toEqual(n);
};

describe('converter', () => {
    let converter: IConverter = new Converter();

    let toJs: (xml:IXDoc) => IJsObject = (xml) => {
        return converter.Convert(xml);
    };

    describe('xml document', () => {

        describe('empty xml document', () => {
            it('has no properties', () => {
                let js = converter.Convert(new XDoc());
                expect(js.properties.length).toEqual(0);
            });
        });

        describe('version attribute', () => {
            let js: IJsObject;
            
            beforeEach(() => {
                let xml: IXDoc = new XDoc();
                xml.Version = "1.0";

                js = converter.Convert(xml);
            });
            
            it('has one property', () => {
                expect(js.properties.length).toEqual(1);
            });

            it('property name is version', () => {
                expect(js.properties[0].name).toEqual('@version');
            });

            it('property value is version value', () => {
                expect(js.properties[0].value).toEqual('1.0');
            });
        });

        describe('encoding attribute', () => {
            let js: IJsObject;

            beforeEach(() => {
                let xml: IXDoc = new XDoc();
                xml.Encoding = "utf-8";

                js = converter.Convert(xml);
            });

            it('has one property', () => {
                expect(js.properties.length).toEqual(1);
            });

            it('property name is encoding', () => {
                expect(js.properties[0].name).toEqual('@encoding');
            });

            it('property value is utf-8', () => {
                expect(js.properties[0].value).toEqual('utf-8');
            });
        });

        describe('root', () => {
            let js: IJsObject;

            beforeEach(() => { 
                let doc: IXDoc = new XDoc();
                let root: IXNode = new XNode("root");
                doc.Root = root;

                js = converter.Convert(doc);
            });

            it('has property', () => {
                expect(js.properties.length).toEqual(1);
            });

            it('has proper name', () => {
                expect(js.properties[0].name).toEqual('root');
            });

            it('has proper value', () => {
                let o = <IJsObject>js.properties[0].value;

                expect(o).not.toBeNull();
                expect(o.properties).not.toBeNull();
                expect(o.properties).toBeDefined();
            });
        });

        describe('root with attributes', () => {
            let js: IJsObject;

            let findRootProp: (name: string) => IJsProperty = (n) => {
                let root = <IJsObject>js.properties[0].value;
                return findProp(root, n);
            };

            let hasRoot: (js: IJsObject) => IJsObject = (o) => {
                expect(o.properties.length).toEqual(1);
                return <IJsObject>o.properties[0].value;
            };

            let expectProperty: (name: string) => void = (n) => {
                let prop = findRootProp(n);
                expect(prop).toBeDefined();
                expect(prop).not.toBeNull();
                expect(prop.name).toEqual(n);
            };

            beforeEach(() => {
                let xml: IXDoc = new XDoc();
                let root: IXNode = new XNode("person");

                root.Attributes = [
                    XAttribute.Get("name", "Mikalai Kardash"),
                    XAttribute.Get("age", "23"),
                    XAttribute.Get("habbit", "whateverness")
                ];

                xml.Root = root;

                js = converter.Convert(xml);
            });

            it('has root', () => { hasRoot(js); });

            it('has name property assigned to root', () => {
                expectProperty('name');
            });

            it('has name property assigned proper value', () => {
                let name = findRootProp('name');
                expect(name.value).toEqual('Mikalai Kardash');
            });

            it('has age property', () => {
                expectProperty('age');
            });

            it('has age property assigned proper value', () => {
                let age = findRootProp('age');
                expect(age.value).toEqual('23');
            });

            it('has habbit property', () => {
                expectProperty('habbit');
            });

            it('has habbit property assigned proper value', () => {
                let habbit = findRootProp('habbit');
                expect(habbit.value).toEqual('whateverness');
            });
        });

        describe('root with text inside', () => {
            let js: IJsObject;

            beforeEach(() => {
                let xml: IXDoc = new XDoc();
                let root: IXNode = new XNode("packages");

                xml.Root = root;
                root.Children = [<IXText>{ Text: 'some text' }];

                js = converter.Convert(xml);
            });

            it('has property', () => {
                expect(js.properties.length).toEqual(1);
            });

            it('has proper name', () => {
                expect(js.properties[0].name).toEqual('packages');
            });

            it('root node has property', () => {
                let root = js.properties[0];
                let val = <IJsObject>root.value;

                expect(val.properties.length).toEqual(2);
            });

            it('root node property named text', () => {
                let root = js.properties[0];
                let val = <IJsObject>root.value;
                expect(val.properties[1].name).toEqual('@text');                
            });

            it('root node property value eq \'some text\'', () => {
                let root = js.properties[0];
                let val = <IJsObject>root.value;
                expect(val.properties[1].value).toEqual('some text');
            });
        });

        describe('root with two sub-nodes inside', () => {
            let js: IJsObject;

            let getRoot: () => IJsObject = () => {
                return <IJsObject>js.properties[0].value;
            };

            beforeEach(() => {
                let doc: IXDoc = new XDoc();
                let root: IXNode = new XNode('packages');

                let p1 = new XNode('package');

                p1.Attributes = [
                    XAttribute.Get('name', 'unity'),
                    XAttribute.Get('version', '4.0')
                ];

                let p2 = new XNode('package');

                p2.Attributes = [
                    XAttribute.Get('name', 'json'),
                    XAttribute.Get('version', '3.5.2'),
                ];

                root.Children = [ p1, p2 ];

                doc.Root = root;

                js = converter.Convert(doc);
            });

            it('has root', () => {
                expect(js.properties.length).toEqual(1);
            });

            it('root has 2 properties', () => {
                let root = getRoot();
                expect(root.properties.length).toEqual(2);
            });

            it('second property is the array', () => {
                let root = getRoot();
                let arr = <IJsArray>findProp(root, '@items').value;
                expect(arr.children).toBeDefined();
            });

             it('array contains two items', () => {
                let root = getRoot();
                let arr = <IJsArray>findProp(root, '@items').value;
                expect(arr.children.length).toEqual(2);

                log(js);
            });

            it('array contains unity package', () => {
                let root = getRoot();
                let arr = <IJsArray>findProp(root, '@items').value;
                let unity = <IJsObject>arr.children[0];

                let name = findProp(unity, 'name');
                let version = findProp(unity, 'version');

                expect(name.value).toEqual('unity');
                expect(version.value).toEqual('4.0');
            });
        });

        describe('root with text and sub-node', () => {
            let js: IJsObject;

            beforeEach(() => {
                let doc: IXDoc = new XDoc();
                let root: IXNode = new XNode('packages');

                root.Children = [
                    new XText('text'),
                    new XNode('package'),
                ];

                doc.Root = root;

                js = converter.Convert(doc);
            });

            it('has root', () => {
                expect(js.properties.length).toEqual(1);
            });

            it('root has text property', () => {
                let root = <IJsObject>js.properties[0].value;
                expectProp(root, '@text');
            });

            it('root has package property', () => {
                let root = <IJsObject>js.properties[0].value;
                expectProp(root, '@items');
            });
        });
    });
});