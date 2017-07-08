import { INameSetter } from "../../lib/process/parse/setters";

class TestNameSetter implements INameSetter {
    public name = "";

    public setName(name: string): void {
        this.name = name;
    }
}

export default TestNameSetter;
