import { convert as ConvertXmlToJS } from '../src/index';
import { readFile } from './reader';
import { SpecConfiguration } from './spec.config';

var config = new SpecConfiguration();

let normalize = (s: string) => {
    return JSON.stringify(JSON.parse(s), null, 4);
}

describe('xconvert', () => {

    describe('empty XML file', () => {

        it("without XML header converts to empty object", (done) => {
            let input: string;
            let output: string;
            let actual: string; 
            
            readFile(config.GetInput('empty/1')).then((result) => {
                input = result;

                readFile(config.GetOutput('empty/1')).then((result) => {
                    output = result;

                    actual = ConvertXmlToJS(input);
                    expect(actual).toEqual(output); 

                    done();

                }, (err) => {});
            }, (err) => {});
        });

    });

    it('converts empty xml file into empty object', () => {
        var output = ConvertXmlToJS('');
        expect(output).toEqual('{}');
    });

    describe('real xml document conversion', () => {
        let converted: string;
        let expected: string;

        beforeEach((done) => {
            readFile(config.GetInput('real/packages')).then((xml) => {

                converted = ConvertXmlToJS(xml);
                converted = normalize(converted);

                readFile(config.GetOutput('real/packages')).then((json) => {
                    expected = normalize(json);

                    done();
                }, () => {});

            }, () => {});
        });

        it('matches converted xml with expected output', () => {
            expect(converted).toEqual(expected);
        });
    });

});