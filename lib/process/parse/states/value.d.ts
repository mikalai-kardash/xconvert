import { IValueSetter } from "../setters";
import { IState, IStateManager } from "../states";
declare class Value implements IState {
    manager: IStateManager;
    prev: IState;
    valueSetter: IValueSetter;
    temp: string;
    count: number;
    startedWith: string;
    constructor(manager: IStateManager, prev: IState, valueSetter: IValueSetter);
    read(ch: string): void;
}
export default Value;
