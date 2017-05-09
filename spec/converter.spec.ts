import * as util from "util";
import { Converter, IConverter } from "../src/process/convert/converter";
import {
    IXAttribute,
    IXComment,
    IXDoc,
    IXNode,
    IXText,
    XAttribute,
    XComment,
    XDoc,
    XNode,
    XText,
} from "../src/xml/schema";

const log = (obj) => {
    // tslint:disable-next-line:no-console
    console.log(JSON.stringify(obj, null, 4));
};

const findProp: (obj: IJsObject, name: string) => IJsProperty = (o, n) => {
    return o.properties.find((p) => {
        return p.name === n;
    });
};

const expectProp: (obj: IJsObject, name: string) => void = (o, n) => {
    const p = findProp(o, n);
    expect(p).toBeDefined();
    expect(p).not.toBeNull();
    expect(p.name).toEqual(n);
};

describe("converter", () => {
    const converter: IConverter = new Converter();

    const toJs: (xml: IXDoc) => IJsObject = (xml) => {
        return converter.Convert(xml);
    };

    describe("xml document", () => {

        describe("empty xml document", () => {
            it("has no properties", () => {
                const js = converter.Convert(new XDoc());
                expect(js.properties.length).toEqual(0);
            });
        });

        describe("version attribute", () => {
            let js: IJsObject;

            beforeEach(() => {
                const xml: IXDoc = new XDoc();
                xml.Version = "1.0";

                js = converter.Convert(xml);
            });

            it("has one property", () => {
                expect(js.properties.length).toEqual(1);
            });

            it("property name is version", () => {
                expect(js.properties[0].name).toEqual("@version");
            });

            it("property value is version value", () => {
                expect(js.properties[0].value).toEqual("1.0");
            });
        });

        describe("encoding attribute", () => {
            let js: IJsObject;

            beforeEach(() => {
                const xml: IXDoc = new XDoc();
                xml.Encoding = "utf-8";

                js = converter.Convert(xml);
            });

            it("has one property", () => {
                expect(js.properties.length).toEqual(1);
            });

            it("property name is encoding", () => {
                expect(js.properties[0].name).toEqual("@encoding");
            });

            it("property value is utf-8", () => {
                expect(js.properties[0].value).toEqual("utf-8");
            });
        });

        describe("root", () => {
            let js: IJsObject;

            beforeEach(() => {
                const doc: IXDoc = new XDoc();
                const root: IXNode = new XNode("root");
                doc.Root = root;

                js = converter.Convert(doc);
            });

            it("has property", () => {
                expect(js.properties.length).toEqual(1);
            });

            it("has proper name", () => {
                expect(js.properties[0].name).toEqual("root");
            });

            it("has proper value", () => {
                const o = js.properties[0].value as IJsObject;

                expect(o).not.toBeNull();
                expect(o.properties).not.toBeNull();
                expect(o.properties).toBeDefined();
            });
        });

        describe("root with attributes", () => {
            let js: IJsObject;

            const findRootProp: (name: string) => IJsProperty = (n) => {
                const root = js.properties[0].value as IJsObject;
                return findProp(root, n);
            };

            const hasRoot: (js: IJsObject) => IJsObject = (o) => {
                expect(o.properties.length).toEqual(1);
                return o.properties[0].value as IJsObject;
            };

            const expectProperty: (name: string) => void = (n) => {
                const prop = findRootProp(n);
                expect(prop).toBeDefined();
                expect(prop).not.toBeNull();
                expect(prop.name).toEqual(n);
            };

            beforeEach(() => {
                const xml: IXDoc = new XDoc();
                const root: IXNode = new XNode("person");

                root.Attributes = [
                    XAttribute.Get("name", "Mikalai Kardash"),
                    XAttribute.Get("age", "23"),
                    XAttribute.Get("habbit", "whateverness"),
                ];

                xml.Root = root;

                js = converter.Convert(xml);
            });

            it("has root", () => { hasRoot(js); });

            it("has name property assigned to root", () => {
                expectProperty("name");
            });

            it("has name property assigned proper value", () => {
                const name = findRootProp("name");
                expect(name.value).toEqual("Mikalai Kardash");
            });

            it("has age property", () => {
                expectProperty("age");
            });

            it("has age property assigned proper value", () => {
                const age = findRootProp("age");
                expect(age.value).toEqual("23");
            });

            it("has habbit property", () => {
                expectProperty("habbit");
            });

            it("has habbit property assigned proper value", () => {
                const habbit = findRootProp("habbit");
                expect(habbit.value).toEqual("whateverness");
            });
        });

        describe("root with text inside", () => {
            let js: IJsObject;

            beforeEach(() => {
                const xml: IXDoc = new XDoc();
                const root: IXNode = new XNode("packages");

                xml.Root = root;
                root.Children = [{ Text: "some text" } as IXText];

                js = converter.Convert(xml);
            });

            it("has property", () => {
                expect(js.properties.length).toEqual(1);
            });

            it("has proper name", () => {
                expect(js.properties[0].name).toEqual("packages");
            });

            it("root node has property", () => {
                const root = js.properties[0];
                const val = root.value as IJsObject;

                expect(val.properties.length).toEqual(2);
            });

            it("root node property named text", () => {
                const root = js.properties[0];
                const val = root.value as IJsObject;
                expect(val.properties[1].name).toEqual("@text");
            });

            it("root node property value eq 'some text'", () => {
                const root = js.properties[0];
                const val = root.value as IJsObject;
                expect(val.properties[1].value).toEqual("some text");
            });
        });

        describe("root with two sub-nodes inside", () => {
            let js: IJsObject;

            const getRoot: () => IJsObject = () => {
                return js.properties[0].value as IJsObject;
            };

            beforeEach(() => {
                const doc: IXDoc = new XDoc();
                const root: IXNode = new XNode("packages");

                const p1 = new XNode("package");

                p1.Attributes = [
                    XAttribute.Get("name", "unity"),
                    XAttribute.Get("version", "4.0"),
                ];

                const p2 = new XNode("package");

                p2.Attributes = [
                    XAttribute.Get("name", "json"),
                    XAttribute.Get("version", "3.5.2"),
                ];

                root.Children = [ p1, p2 ];

                doc.Root = root;

                js = converter.Convert(doc);
            });

            it("has root", () => {
                expect(js.properties.length).toEqual(1);
            });

            it("root has 2 properties", () => {
                const root = getRoot();
                expect(root.properties.length).toEqual(2);
            });

            it("second property is the array", () => {
                const root = getRoot();
                const arr =  findProp(root, "@items").value as IJsArray;
                expect(arr.children).toBeDefined();
            });

            it("array contains two items", () => {
                const root = getRoot();
                const arr =  findProp(root, "@items").value as IJsArray;
                expect(arr.children.length).toEqual(2);
            });

            it("array contains unity package", () => {
                const root = getRoot();
                const arr =  findProp(root, "@items").value as IJsArray;
                const unity =  arr.children[0] as IJsObject;

                const name = findProp(unity, "name");
                const version = findProp(unity, "version");

                expect(name.value).toEqual("unity");
                expect(version.value).toEqual("4.0");
            });
        });

        describe("root with text and sub-node", () => {
            let js: IJsObject;

            beforeEach(() => {
                const doc: IXDoc = new XDoc();
                const root: IXNode = new XNode("packages");

                root.Children = [
                    new XText("text"),
                    new XNode("package"),
                ];

                doc.Root = root;

                js = converter.Convert(doc);
            });

            it("has root", () => {
                expect(js.properties.length).toEqual(1);
            });

            it("root has text property", () => {
                const root =  js.properties[0].value as IJsObject;
                expectProp(root, "@text");
            });

            it("root has package property", () => {
                const root =  js.properties[0].value as IJsObject;
                expectProp(root, "@items");
            });
        });
    });
});
