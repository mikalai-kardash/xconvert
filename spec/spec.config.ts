class SpecConfiguration {
    public FilesPath = "./spec/files/";

    public GetInput(container: string): string {
        return `${this.FilesPath}${container}/input.xml`;
    }

    public GetOutput(container: string): string {
        return `${this.FilesPath}${container}/output.json`;
    }
}

export {
    SpecConfiguration,
};
