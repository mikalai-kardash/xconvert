import { clean } from "./cleaner";
import { Converter, IConverter } from "./converter";
import { parse } from "./parser";
import { stringify } from "./stringifier";

function convert(xmlContent: string): string {
    const c: IConverter = new Converter();

    const xml = parse(xmlContent);
    const betterXml = clean(xml);
    const js = c.Convert(betterXml);
    const str = stringify(js);

    return str;
}

export {
    convert,
};
