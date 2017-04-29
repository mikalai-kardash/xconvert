interface ICleaner {
    clean(xml: IXDoc): IXDoc;
}

class Cleaner implements ICleaner {
    clean(xml: IXDoc): IXDoc {
        return xml;
    }
}

export {
    ICleaner,
    Cleaner
}