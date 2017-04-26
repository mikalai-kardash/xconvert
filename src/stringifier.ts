interface IStringifier {
    Stringify(jsdoc: IJsDoc): string;
}

class Stringifier implements IStringifier {
    Stringify(jsdoc: IJsDoc): string {
        return '{}';
    }
}

export { Stringifier, IStringifier }