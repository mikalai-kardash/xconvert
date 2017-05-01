interface IState {
    read(ch: string): void;
}

interface IStateManager {
    current: IState;
    switchTo(state: IState): void;
    jump(n: number): void;
}
