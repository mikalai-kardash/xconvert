import { IAttributeAdder, INameSetter, IValueSetter } from "../setters";
import { IState, IStateManager } from "../states";
declare class AttributeExpression implements IState, INameSetter, IValueSetter {
    manager: IStateManager;
    prev: IState;
    attributeSetter: IAttributeAdder;
    name: string;
    value: string;
    constructor(manager: IStateManager, prev: IState, attributeSetter: IAttributeAdder);
    read(ch: string): void;
    switchBack(): void;
    switchTo(state: IState): void;
    setName(name: string): void;
    setValue(value: string): void;
}
export default AttributeExpression;
