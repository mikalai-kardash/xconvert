import { Parser, IParser } from './parser';
import { Converter, IConverter } from './converter';
import { Stringifier, IStringifier } from './stringifier';

function convert(xmlContent: string) : string {
    let p: IParser = new Parser();
    let c: IConverter = new Converter();
    let s: IStringifier = new Stringifier();

    let xml = p.Parse(xmlContent);
    let js = c.Convert(xml);
    let str = s.Stringify(js);
    
    return str;
}

export { 
    convert 
};