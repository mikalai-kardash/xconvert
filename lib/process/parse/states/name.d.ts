import { INameSetter } from "../setters";
import { IState, IStateManager } from "../states";
declare class Name implements IState {
    manager: IStateManager;
    prev: IState;
    nameSetter: INameSetter;
    temp: string;
    constructor(manager: IStateManager, prev: IState, nameSetter: INameSetter);
    read(ch: string): void;
}
export default Name;
