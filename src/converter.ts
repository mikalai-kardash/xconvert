interface IConverter {
    Convert(document:IXDoc): IJsDoc;
}

class Converter implements IConverter {
    Convert(document: IXDoc): IJsDoc {
        return null;
    }
}

export { Converter, IConverter };