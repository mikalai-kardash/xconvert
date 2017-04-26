"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Symbols;
(function (Symbols) {
    Symbols.NodeOpening = '<';
    Symbols.NodeClosing = '>';
    Symbols.Prolog = '?';
    Symbols.Space = ' ';
    Symbols.Equal = '=';
    Symbols.DoubleQuote = '"';
    Symbols.ForwardSlash = '/';
    Symbols.BackwardSlash = '\\';
})(Symbols || (Symbols = {}));
var Expressions;
(function (Expressions) {
    Expressions.NodeName = /\w/;
})(Expressions || (Expressions = {}));
var Value = (function () {
    function Value(manager, prev, valueSetter) {
        this.manager = manager;
        this.prev = prev;
        this.valueSetter = valueSetter;
        this.temp = '';
        this.count = 0;
    }
    Value.prototype.read = function (ch) {
        switch (ch) {
            case Symbols.DoubleQuote:
                this.count++;
                if (this.count > 1) {
                    this.manager.switchTo(this.prev);
                    this.valueSetter.setValue(this.temp);
                    return;
                }
                break;
            default:
                {
                    this.temp += ch;
                }
                break;
        }
    };
    return Value;
}());
exports.Value = Value;
var Name = (function () {
    function Name(manager, prev, nameSetter) {
        this.manager = manager;
        this.prev = prev;
        this.nameSetter = nameSetter;
        this.temp = '';
    }
    Name.prototype.read = function (ch) {
        switch (ch) {
            case Symbols.Equal:
                this.nameSetter.setName(this.temp);
                this.manager.switchTo(this.prev);
                this.prev.read(ch);
                break;
            default:
                {
                    this.temp += ch;
                }
                break;
        }
    };
    return Name;
}());
exports.Name = Name;
var AttributeExpression = (function () {
    function AttributeExpression(manager, prev, attributeSetter) {
        this.manager = manager;
        this.prev = prev;
        this.attributeSetter = attributeSetter;
        this.name = '';
        this.value = '';
    }
    AttributeExpression.prototype.read = function (ch) {
        switch (ch) {
            case Symbols.Equal:
                {
                    var value = new Value(this.manager, this, this);
                    this.switchTo(value);
                }
                break;
            case Symbols.Space:
                {
                    this.switchBack();
                    this.prev.read(ch);
                }
                break;
            default:
                {
                    var name = new Name(this.manager, this, this);
                    this.switchTo(name);
                    name.read(ch);
                }
                break;
        }
    };
    AttributeExpression.prototype.switchBack = function () {
        this.attributeSetter.addAttribute({
            Name: this.name,
            Value: this.value
        });
        this.manager.switchTo(this.prev);
    };
    AttributeExpression.prototype.switchTo = function (state) {
        this.manager.switchTo(state);
    };
    AttributeExpression.prototype.setName = function (name) {
        this.name = name;
    };
    AttributeExpression.prototype.setValue = function (value) {
        this.value = value;
        this.switchBack();
    };
    return AttributeExpression;
}());
exports.AttributeExpression = AttributeExpression;
var PrologExpression = (function () {
    function PrologExpression(manager, prev, attributeAdder) {
        this.manager = manager;
        this.prev = prev;
        this.attributeAdder = attributeAdder;
        this.attributes = [];
    }
    PrologExpression.prototype.read = function (ch) {
        switch (ch) {
            case Symbols.NodeClosing:
                if (this.previousChar === Symbols.Prolog) {
                    this.switchBack();
                }
                return;
            case 'x':
            case 'm':
            case 'l':
                return;
            case Symbols.Prolog:
            case Symbols.Space:
                this.wait(ch);
                break;
            default:
                {
                    if (this.previousChar === Symbols.Space) {
                        this.previousChar = '';
                        var attribute = new AttributeExpression(this.manager, this, this);
                        this.switchTo(attribute);
                        attribute.read(ch);
                    }
                    else {
                        this.wait(ch);
                    }
                }
                break;
        }
    };
    PrologExpression.prototype.wait = function (ch) {
        this.previousChar = ch;
    };
    ;
    PrologExpression.prototype.addAttribute = function (attr) {
        this.attributes.push(attr);
    };
    PrologExpression.prototype.switchTo = function (state) {
        this.manager.switchTo(state);
    };
    PrologExpression.prototype.switchBack = function () {
        var _this = this;
        this.manager.switchTo(this.prev);
        this.attributes.forEach(function (a) { _this.attributeAdder.addAttribute(a); });
    };
    return PrologExpression;
}());
exports.PrologExpression = PrologExpression;
var TextExpression = (function () {
    function TextExpression(manager, prev, textAdder) {
        this.manager = manager;
        this.prev = prev;
        this.textAdder = textAdder;
        this.text = '';
    }
    TextExpression.prototype.read = function (ch) {
        switch (ch) {
            case Symbols.NodeOpening:
                this.switchBack();
                break;
            default:
                {
                    this.text += ch;
                }
                break;
        }
    };
    TextExpression.prototype.switchBack = function () {
        this.manager.switchTo(this.prev);
        this.textAdder.addText({
            Text: this.text
        });
    };
    return TextExpression;
}());
exports.TextExpression = TextExpression;
var NodeExpression = (function () {
    function NodeExpression(manager, prev, nodeAdder) {
        this.manager = manager;
        this.prev = prev;
        this.nodeAdder = nodeAdder;
        this.attributes = [];
        this.children = [];
        this.name = '';
        this.closingTag = '';
        this.previousChar = '';
        this.readingName = true;
        this.readingAttributes = false;
        this.readingContents = false;
        this.waitingForClosingTag = false;
    }
    NodeExpression.prototype.read = function (ch) {
        if (this.readingName) {
            this.readName(ch);
        }
        if (this.readingAttributes) {
            this.readAttributes(ch);
            return;
        }
        if (this.readingContents) {
            this.readContents(ch);
        }
        if (this.waitingForClosingTag) {
            this.waitForClosingTag(ch);
        }
    };
    NodeExpression.prototype.readName = function (ch) {
        if (Expressions.NodeName.test(ch)) {
            this.name += ch;
        }
        else {
            this.readingName = false;
            this.readingAttributes = true;
        }
    };
    NodeExpression.prototype.readAttributes = function (ch) {
        switch (ch) {
            case Symbols.NodeClosing:
                this.readingAttributes = false;
                if (this.previousChar === Symbols.ForwardSlash) {
                    this.switchBack();
                    return;
                }
                this.readingContents = true;
                break;
            case Symbols.Space:
                break;
            case Symbols.ForwardSlash:
                this.previousChar = ch;
                break;
            default:
                {
                    var attr = new AttributeExpression(this.manager, this, this);
                    this.switchTo(attr);
                    attr.read(ch);
                }
                break;
        }
    };
    NodeExpression.prototype.readContents = function (ch) {
        switch (ch) {
            case Symbols.NodeOpening:
                this.readingContents = false;
                this.waitingForClosingTag = true;
                break;
            default:
                {
                    var text = new TextExpression(this.manager, this, this);
                    this.switchTo(text);
                    text.read(ch);
                }
                break;
        }
    };
    NodeExpression.prototype.waitForClosingTag = function (ch) {
        this.closingTag += ch;
        if (this.closingTag === "</" + this.name + ">") {
            this.switchBack();
        }
    };
    NodeExpression.prototype.switchBack = function () {
        this.manager.switchTo(this.prev);
        var xNode = {
            Name: this.name
        };
        if (this.attributes) {
            xNode.Attributes = [];
        }
        this.attributes.forEach(function (a) {
            xNode.Attributes.push(a);
        });
        this.nodeAdder.addNode(xNode);
    };
    NodeExpression.prototype.switchTo = function (state) {
        this.manager.switchTo(state);
    };
    NodeExpression.prototype.addAttribute = function (attr) {
        this.attributes.push(attr);
    };
    NodeExpression.prototype.addText = function (text) {
        this.children.push(text);
    };
    return NodeExpression;
}());
exports.NodeExpression = NodeExpression;
var Default = (function () {
    function Default(manager, prev) {
        this.manager = manager;
        this.prev = prev;
        this.attributes = [];
        this.nodes = [];
    }
    Default.prototype.read = function (ch) {
        switch (ch) {
            case Symbols.NodeOpening:
                this.wait(ch);
                break;
            case Symbols.Prolog:
                if (this.previousChar === Symbols.NodeOpening) {
                    this.previousChar = '';
                    this.manager.switchTo(new PrologExpression(this.manager, this, this));
                }
                break;
            default:
                {
                    if (this.previousChar === Symbols.NodeOpening) {
                        var nameSymbol = /\w/;
                        if (nameSymbol.test(ch)) {
                            this.previousChar = '';
                            var node = new NodeExpression(this.manager, this, this);
                            this.switchTo(node);
                            node.read(ch);
                        }
                    }
                }
                break;
        }
    };
    Default.prototype.wait = function (ch) {
        this.previousChar = ch;
    };
    ;
    Default.prototype.addAttribute = function (attr) {
        this.attributes.push(attr);
    };
    Default.prototype.addNode = function (node) {
        this.nodes.push(node);
    };
    Default.prototype.switchTo = function (state) {
        this.manager.switchTo(state);
    };
    return Default;
}());
var Parser = (function () {
    function Parser() {
    }
    Parser.prototype.switchTo = function (state) {
        this.current = state;
    };
    Parser.prototype.read = function (ch) {
        this.current.read(ch);
    };
    Parser.prototype.Parse = function (xmlContent) {
        var d = new Default(this, null);
        this.switchTo(d);
        for (var i = 0; i < xmlContent.length; i++) {
            this.read(xmlContent[i]);
        }
        var xDoc = { Version: '', Root: null };
        var attrs = d.attributes;
        attrs.forEach(function (a) {
            switch (a.Name) {
                case 'version':
                    xDoc.Version = a.Value;
                    break;
            }
        });
        if (d.nodes.length !== 0) {
            xDoc.Root = d.nodes[0];
        }
        return xDoc;
    };
    return Parser;
}());
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map