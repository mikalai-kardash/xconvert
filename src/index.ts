import { parse } from './parser';
import { Converter, IConverter } from './converter';
import { stringify } from './stringifier';
import { clean } from './cleaner';

function convert(xmlContent: string) : string {
    let c: IConverter = new Converter();

    let xml = parse(xmlContent);
    let betterXml = clean(xml);
    let js = c.Convert(betterXml);
    let str = stringify(js);
    
    return str;
}

export { 
    convert 
};