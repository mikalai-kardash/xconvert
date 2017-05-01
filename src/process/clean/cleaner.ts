import Inspector from "./inspector";

interface ICleaner {
    clean(xml: IXDoc): IXDoc;
}

class Cleaner implements ICleaner {
    public clean(xml: IXDoc): IXDoc {
        const i = new Inspector();
        xml.Accept(i);
        return i.document;
    }
}

function clean(xml: IXDoc): IXDoc {
    const cleaner = new Cleaner();
    return cleaner.clean(xml);
}

export {
    clean,
    Cleaner,
    ICleaner,
};
