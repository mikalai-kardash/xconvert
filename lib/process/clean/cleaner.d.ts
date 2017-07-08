import { IXDoc } from "../../xml/schema";
interface ICleaner {
    clean(xml: IXDoc): IXDoc;
}
declare class Cleaner implements ICleaner {
    clean(xml: IXDoc): IXDoc;
}
declare function clean(xml: IXDoc): IXDoc;
export { clean, Cleaner, ICleaner };
