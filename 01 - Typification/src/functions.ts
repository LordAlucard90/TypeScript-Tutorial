// add takes two number and returns a number
const add = (a: number, b: number): number => {
    return a + b;
};
// the return type is automatically inferred
const addInferred = (a: number, b: number) => {
    return a + b;
};
// with no return the void is inferred
const voidInferred = (a: number, b: number) => {
    console.log(a, b);
};

const logger = (message: string): void => {
    console.log(message);
};

const error = (message: string): never => {
    throw new Error(message);
};
