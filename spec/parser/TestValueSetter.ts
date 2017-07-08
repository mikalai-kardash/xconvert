import { IValueSetter } from "../../lib/process/parse/setters";

class TestValueSetter implements IValueSetter {
    public value: string;

    public setValue(value: string): void {
        this.value = value;
    }
}

export default TestValueSetter;
