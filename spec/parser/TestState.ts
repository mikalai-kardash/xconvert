class TestState implements IState {
    public temp = "";

    public read(ch: string): void {
        this.temp += ch;
    }
}

export default TestState;
