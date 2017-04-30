import { stringify } from '../src/stringifier';
import { JsObject, JsProperty, JsArray } from '../src/jsdoc';

describe('stringifier', () => {

    describe('incorrect values', () => {
        
        it('null', () => {
            let out = stringify(null);
            expect(out).toEqual(JSON.stringify(null));
        });

        it('undefined', () => {
            let out = stringify(undefined);
            expect(out).toEqual(JSON.stringify(undefined));
        });

    });

    describe('empty js object', () => {

        let str: string;

        beforeEach(() => {
            let js = new JsObject();
            str = stringify(js);
        });

        it('creates empty object literal', () => {
            expect(str).toEqual('{}');
        });

    });

    describe('js object', () => {
        let str: string;
        let json;

        beforeEach(() => {
            let js: IJsObject = new JsObject();
            let obj: IJsObject = new JsObject();
            let arr: IJsArray = new JsArray();

            js.properties = [
                new JsProperty('name', 'unity'),
                new JsProperty('object', obj),
                new JsProperty('array', arr)
            ];

            str = stringify(js);
            json = JSON.parse(str);
        });

        it('has name property', () => {
            expect(json.name).toBeDefined();
            expect(json.name).not.toBeNull();
        });

        it('has object property', () => {
            expect(json.object).toBeDefined();
            expect(json.object).not.toBeNull();            
        });

        it('has array property', () => {
            expect(json.array).toBeDefined();
            expect(json.array).not.toBeNull();
            expect(json.array.length).toEqual(0);
        });
    });

    describe('js array', () => {

        let str: string;
        let json;

        beforeEach(() => {
            let js = new JsArray();
            let o = new JsObject();

            o.properties = [
                new JsProperty('name', 'unity')
            ];

            js.children = [
                "some text",
                o
            ];

            str = stringify(js);
            json = JSON.parse(str);
        });

        it('not null', () => {
            expect(json).toBeDefined();
            expect(json).not.toBeNull();
        });

        it('has items', () => {
            expect(json.length).toBeGreaterThan(0);
        });

        it('contains text', () => {
            expect(json[0]).toEqual('some text');
        });

        it('contains object', () => {
            let o = json[1];
            expect(o).toBeDefined();
            expect(o).not.toBeNull();
            expect(o.name).toEqual('unity');
        });

    });

});