import { IValueSetter } from "../../src/process/parse/setters";

class TestValueSetter implements IValueSetter {
    public value: string;

    public setValue(value: string): void {
        this.value = value;
    }
}

export default TestValueSetter;
