import { IXDoc } from "../../xml/xdoc";
import { IState, IStateManager } from "./states";
interface IParser {
    Parse(xmlContent: string): IXDoc;
}
declare class Parser implements IParser, IStateManager {
    current: IState;
    position: number;
    switchTo(state: IState): void;
    read(ch: string): void;
    jump(n: number): void;
    Parse(xmlContent: string): IXDoc;
    GetXmlDocument(): IXDoc;
}
declare function parse(xml: string): IXDoc;
export { IParser, Parser, parse };
