import { convert as ConvertXmlToJS } from "../src/index";
import { readFile } from "./reader";
import { SpecConfiguration } from "./spec.config";

const config = new SpecConfiguration();

const normalize = (s: string) => {
    return JSON.stringify(JSON.parse(s), null, 4);
};

describe("xconvert", () => {

    describe("empty XML file", () => {

        it("without XML header converts to empty object", (done) => {
            let input: string;
            let output: string;
            let actual: string;

            readFile(config.GetInput("empty/1")).then((result) => {
                input = result as string;

                readFile(config.GetOutput("empty/1")).then((o) => {
                    output = o as string;

                    actual = ConvertXmlToJS(input);
                    expect(actual).toEqual(output);

                    done();

                // tslint:disable-next-line:no-empty
                }, (err) => {});
            // tslint:disable-next-line:no-empty
            }, (err) => {});
        });

    });

    it("converts empty xml file into empty object", () => {
        const output = ConvertXmlToJS("");
        expect(output).toEqual("{}");
    });

    describe("real xml document conversion - packages", () => {
        let converted: string;
        let expected: string;

        beforeEach((done) => {
            readFile(config.GetInput("real/packages")).then((xml) => {

                converted = ConvertXmlToJS(xml as string);
                converted = normalize(converted);

                readFile(config.GetOutput("real/packages")).then((json) => {
                    expected = normalize(json as string);

                    done();
                // tslint:disable-next-line:no-empty
                }, () => {});

            // tslint:disable-next-line:no-empty
            }, () => {});
        });

        it("matches converted xml with expected output", () => {
            expect(converted).toEqual(expected);
        });
    });

    describe("real xml document conversion - android sdk list", () => {
        let converted: string;
        let expected: string;

        beforeEach((done) => {
            readFile(config.GetInput("real/android-sdk-list")).then((xml) => {

                converted = ConvertXmlToJS(xml as string);
                converted = normalize(converted);

                readFile(config.GetOutput("real/android-sdk-list")).then((json) => {
                    expected = normalize(json as string);

                    done();
                // tslint:disable-next-line:no-empty
                }, () => {});

            // tslint:disable-next-line:no-empty
            }, () => {});
        });

        it("matches converted xml with expected output", () => {
            expect(converted).toEqual(expected);
        });
    });

});
