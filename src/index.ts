import { Parser, IParser } from './parser';
import { Converter, IConverter } from './converter';
import { Stringifier, IStringifier } from './stringifier';
import { Cleaner, ICleaner } from './cleaner';

function convert(xmlContent: string) : string {
    let p: IParser = new Parser();
    let c: IConverter = new Converter();
    let s: IStringifier = new Stringifier();
    let cl: ICleaner = new Cleaner();

    let xml = p.Parse(xmlContent);
    let betterXml = cl.clean(xml);
    let js = c.Convert(betterXml);
    let str = s.Stringify(js);
    
    return str;
}

export { 
    convert 
};