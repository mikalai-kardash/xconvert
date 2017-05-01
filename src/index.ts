import { clean } from "./process/clean/cleaner";
import { convert as convertToJs, Converter, IConverter } from "./process/convert/converter";
import { parse } from "./process/parse/parser";
import { stringify } from "./process/stringify/stringifier";

function convert(content: string): string {
    const xmlDoc = parse(content);
    const cleanXmlDoc = clean(xmlDoc);
    const jsDoc = convertToJs(cleanXmlDoc);
    const str = stringify(jsDoc);
    return str;
}

export {
    convert,
};
