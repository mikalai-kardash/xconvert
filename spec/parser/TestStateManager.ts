class TestStateManager implements IStateManager {
    public current: IState;
    public position: number = 0;

    public switchTo(state: IState): void {
        this.current = state;
    }

    public parse(input: string): void {
        this.position = 0;
        for (; this.position < input.length; this.position++) {
            const ch = input[this.position];
            this.current.read(ch);
        }
    }

    public jump(n: number): void {
        this.position += n;
    }
}

export default TestStateManager;
