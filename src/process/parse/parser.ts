import { IXDoc, XDoc } from "../../xml/xdoc";
import { IState, IStateManager } from "./states";
import Default from "./states/default";

interface IParser {
    Parse(xmlContent: string): IXDoc;
}

class Parser implements IParser, IStateManager {
    public current: IState;
    public position: number = 0;

    public switchTo(state: IState): void {
        this.current = state;
    }

    public read(ch: string): void {
        this.current.read(ch);
    }

    public jump(n: number): void {
        this.position += n;
    }

    public Parse(xmlContent: string): IXDoc {
        const d = new Default(this, null);

        this.switchTo(d);
        this.position = 0;

        for (; this.position < xmlContent.length; this.position++) {
            const ch = xmlContent[this.position];
            this.read(ch);
        }

        const xDoc: IXDoc = new XDoc();
        const attrs = d.attributes;

        attrs.forEach((a) => {
            switch (a.Name) {
                case "version":
                    xDoc.Version = a.Value;
                    break;

                case "encoding":
                    xDoc.Encoding = a.Value;
                    break;
            }
        });

        if (d.nodes.length !== 0) {
            xDoc.Root = d.nodes[0];
        }

        const comments = d.comments;
        if (comments.length > 0) {
            xDoc.Comments = [];
            comments.forEach((c) => {
                xDoc.Comments.push(c);
            });
        }

        return xDoc;
    }
}

function parse(xml: string): IXDoc {
    const parser: IParser = new Parser();
    return parser.Parse(xml);
}

export {
    IParser,
    Parser,
    parse,
};
