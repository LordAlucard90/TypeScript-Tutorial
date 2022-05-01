class ArrayOfAnything<T> {
    constructor(public collection: T[]) {}

    get(index: number): T {
        return this.collection[index];
    }
}
const arrayOfStrings = new ArrayOfAnything<string>(['a', 'b', 'c']);
console.log(arrayOfStrings.collection);
console.log(arrayOfStrings.get(0));
const arrayOfNumbers = new ArrayOfAnything<number>([1, 2, 3]);
console.log(arrayOfNumbers.collection);
console.log(arrayOfNumbers.get(0));

function printAnything<T>(arr: T[]): void {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}
printAnything<number>([1, 2, 3]);
printAnything<string>(['a', 'b', 'c']);

interface Printable {
    print(): void;
}
class Bike implements Printable {
    print() {
        console.log("I'm a Car!");
    }
}
class House implements Printable {
    print() {
        console.log("I'm an House!");
    }
}
function printHousesOrCars<T extends Printable>(arr: T[]): void {
    for (let i = 0; i < arr.length; i++) {
        arr[i].print();
    }
}
printHousesOrCars<House>([new House(), new House()]);
printHousesOrCars<Bike>([new Bike(), new House()]);
printHousesOrCars([new House(), new House()]);
printHousesOrCars([new Bike(), new Bike()]);
printHousesOrCars([new Bike(), new House()]);

interface Composed {
    aNumber: number;
    aString: string;
}
export class DynamicGetter<T> {
    constructor(private data: T) {}

    get<K extends keyof T>(key: K): T[K] {
        return this.data[key];
    }
}
const getter = new DynamicGetter<Composed>({
    aNumber: 42,
    aString: 'example',
});
const aNumber: number = getter.get('aNumber');
console.log(aNumber);
const aString: string = getter.get('aString');
console.log(aString);

