interface IStringifier {
    Stringify(js: IJsObject): string;
}

class Stringifier implements IStringifier {
    Stringify(js: IJsObject): string {
        return '{}';
    }
}

export { Stringifier, IStringifier }