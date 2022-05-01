@classDecorator // class
class Example {
    @exampleDecorator // property
    exampleField: string = "example";

    @exampleDecorator // accessor
    get formattedField(): string {
        return `The value is: ${this.exampleField}.`
    }

    @exampleDecorator // accessor
    set lowerCaseExample(example: string) {
        this.exampleField = example.toLocaleLowerCase()
    }

    @exampleDecorator // method
    exampleMethod(
        @patameterDecorator exampleParameter: string // parameter
    ): void {
        console.log(exampleParameter)
    }
}

// function exampleDecorator(target: Example, key: string) {
function exampleDecorator(target: any, key: string) {
    console.log("exampleDecorator")
    console.log("Key :", key)
}

// function patameterDecorator(target: Example, key: string, index: number) {
function patameterDecorator(target: any, key: string, index: number) {
    console.log("patameterDecorator")
    console.log(key , index)
}

// function classDecorator(constructor: Function)
function classDecorator(constructor: typeof Example) {
    console.log("classDecorator")
    console.log(constructor)
}
