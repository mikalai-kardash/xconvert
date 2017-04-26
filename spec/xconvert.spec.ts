import { convert as ConvertXmlToJS } from '../src/index';
import { readFile } from './reader';
import { SpecConfiguration } from './spec.config';

var config = new SpecConfiguration();

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

});