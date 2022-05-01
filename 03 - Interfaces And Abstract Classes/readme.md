# Interfaces And Abstract Classes

## Content

- [Setup Compiling](#setup-compiling)
- [Type Guards](#type-guards)
- [Generalizing](#generalizing)
- [Abstract Sorter](#abstract-sorter)

---

## Setup Compiling

In order to configure the typescript compiler, it is possible to run the command
```bash
tsc --init
```
this command will create a file named `tsconfig.json`.\
Now it is possible to update the following properties:
- `"rootDir": "./src",`
- `"outDir": "./build",`, this folder is automatically generated
Now to compile the code is is enough to run in the same directory as 
`tsconfig.json` the command:
```bash
tsc
```
In order to make **tsc** automatically recompile the code on each cahnge
can be run the command:
```bash
tsc -w
```
Once the data is compiled it is possible to run the code using:
```bash
node build/index.js 
```
It is possible to automate all this process installing
```
npm init -y
npm i nodemon concurrently
```
and update the `package.json` with:
```json
{
    //...
    "scripts": {
        "start:build": "tsc -w",
        "start:run": "nodemon build/index.js",
        "start": "concurrently npm:start:*"
    },
    //...
}
```
now it is possible to recompile and rerun the code automatically usin:
```bash
npm start
```

## Simple Sort Implementation

A simple number sorter is:
```typescript
class Sorter {
    constructor(public collection: number[]) {}

    sort(): void {
        const { length } = this.collection;

        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length - i - 1; j++) {
                if (this.collection[j] > this.collection[j + 1]) {
                    const leftHand = this.collection[j];
                    this.collection[j] = this.collection[j + 1];
                    this.collection[j + 1] = leftHand;
                }
            }
        }
    }
}
```
unfortunately if we want tu run this algorithm with string it will not work
because string are immutable.

## Type Guards

It is possible to support multiple collection types using the unit `|` operator:
```typescript
class Sorter {
    constructor(public collection: number[] | string) {}
    // ...
}
```
unfortunately all the methods that are not shared will be trowed away.

It is possible to use a type Guard to force locally the current type of the
collection and to be able to see all its methods:
```typescript
class Sorter {
    // ...

    sort(): void {
        const { length } = this.collection;

        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length - i - 1; j++) {
                if (this.collection instanceof Array) {
                    // ...
                }

                if (typeof this.collection === 'string') {
                    // ...
                }
            }
        }
    }
}
```

Depending of the type of the element the type guard changes its definition:
- **Primitive Types**: `typeof` (number, string, boolean, symbol)
- **Other Types**: `instanceof`

this approach is not performant.

## Generalizing

Like in the previous project the right way to implement this logic is a reversion
of responsibility with the introduction of an interface:
```typescript
export interface Sortable {
    length: number;
    compare(leftIndex: number, rightIndex: number): boolean;
    swap(leftIndex: number, rightIndex: number): void;
}

export class Sorter {
    constructor(public collection: Sortable) {}

    sort(): void {
        const { length } = this.collection;

        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length - i - 1; j++) {
                if (this.collection.compare(j, j + 1)) {
                    this.collection.swap(j, j + 1);
                }
            }
        }
    }
}
```
and its implementation for the different collections types that we want to address:
```typescript
// Array of Numbers
export class NumbersCollection implements Sortable {
    constructor(public data: number[]) {}

    compare(leftIndex: number, rightIndex: number): boolean {
        return this.data[leftIndex] > this.data[rightIndex];
    }

    swap(leftIndex: number, rightIndex: number): void {
        const leftHand = this.data[leftIndex];
        this.data[leftIndex] = this.data[rightIndex];
        this.data[rightIndex] = leftHand;
    }

    get length(): number {
        return this.data.length;
    }
}

// String
export class CharactersCollection implements Sortable {
    constructor(public data: string) {}

    compare(leftIndex: number, rightIndex: number): boolean {
        return this.data[leftIndex].toLowerCase() > this.data[rightIndex].toLowerCase();
    }

    swap(leftIndex: number, rightIndex: number): void {
        const characters = this.data.split('');
        const leftHand = characters[leftIndex];
        characters[leftIndex] = characters[rightIndex];
        characters[rightIndex] = leftHand;
        this.data = characters.join('');
    }

    get length(): number {
        return this.data.length;
    }
}

// Linked List
class Node {
    next: Node | null = null;

    constructor(public data: number) {}
}

export class LinkedList implements Sortable {
    head: Node | null = null;

    add(data: number): void {
        const node = new Node(data);

        if (!this.head) {
            this.head = node;
            return;
        }

        let tail = this.head;
        while (tail.next) {
            tail = tail.next;
        }
        tail.next = node;
    }

    get length(): number {
        if (!this.head) {
            return 0;
        }

        let length = 1;
        let cur = this.head;
        while (cur.next) {
            cur = cur.next;
            length++;
        }
        return length;
    }

    at(index: number): Node {
        if (!this.head) {
            throw new Error('Index out of bound.');
        }

        let cur: Node | null = this.head;
        for (let i = 0; i < index; i++) {
            cur = cur.next;
            if (!cur) {
                throw new Error('Index out of bound.');
            }
        }

        return cur;
    }

    compare(leftIndex: number, rightIndex: number): boolean {
        if (!this.head) {
            throw new Error('List is empty');
        }
        return this.at(leftIndex).data > this.at(rightIndex).data;
    }

    swap(leftIndex: number, rightIndex: number): void {
        const leftNode = this.at(leftIndex);
        const rightNode = this.at(rightIndex);

        const leftHandData = leftNode.data;
        leftNode.data = rightNode.data;
        rightNode.data = leftHandData;
    }

    print(): void {
        if (!this.head) {
            return;
        }
        const values: number[] = [];
        let cur: Node | null = this.head;
        while (cur) {
            values.push(cur.data);
            cur = cur.next;
        }
        console.log(values);
    }
}
```
in the end usage is:
```typescript
const numbersCollection = new NumbersCollection([10, 3, -5, 0])
const numberSorter = new Sorter(numbersCollection);
console.log('Numbers Collection:\n', numberSorter.collection);
numberSorter.sort();
console.log('Numbers Collection sorted:\n', numberSorter.collection);

const charactersCollection = new CharactersCollection("AsDfGh")
const characterSorter = new Sorter(charactersCollection);
console.log('Characters Collection:\n', characterSorter.collection);
characterSorter.sort();
console.log('Characters Collection sorted:\n', characterSorter.collection);

const linkedList = new LinkedList()
linkedList.add(10)
linkedList.add(3)
linkedList.add(-5)
linkedList.add(0)
const linkedSorter = new Sorter(linkedList);
console.log('Linked List:');
linkedList.print()
linkedSorter.sort();
console.log('Linked List sorted:');
linkedList.print()
```


## Abstract Sorter

Use a Sorter class works, but it is more cleaner to have the `.sort()` method
directly inside the different collections.\
This means that each collection will have to extend an **AbstractSorter** class:
```typescript
export abstract class AbstractSorter {
    abstract length: number;
    abstract compare(leftIndex: number, rightIndex: number): boolean;
    abstract swap(leftIndex: number, rightIndex: number): void;

    sort(): void {
        const { length } = this;

        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length - i - 1; j++) {
                if (this.compare(j, j + 1)) {
                    this.swap(j, j + 1);
                }
            }
        }
    }
}
```
the collection now becomes:
```typescript
// Array of Numbers
export class NumbersCollection extends AbstractSorter {
    constructor(public data: number[]) {
        super();
    }

    compare(leftIndex: number, rightIndex: number): boolean {
        return this.data[leftIndex] > this.data[rightIndex];
    }

    swap(leftIndex: number, rightIndex: number): void {
        const leftHand = this.data[leftIndex];
        this.data[leftIndex] = this.data[rightIndex];
        this.data[rightIndex] = leftHand;
    }

    get length(): number {
        return this.data.length;
    }
}

// String
export class CharactersCollection extends AbstractSorter {
    constructor(public data: string) {
        super();
    }

    compare(leftIndex: number, rightIndex: number): boolean {
        return this.data[leftIndex].toLowerCase() > this.data[rightIndex].toLowerCase();
    }

    swap(leftIndex: number, rightIndex: number): void {
        const characters = this.data.split('');
        const leftHand = characters[leftIndex];
        characters[leftIndex] = characters[rightIndex];
        characters[rightIndex] = leftHand;
        this.data = characters.join('');
    }

    get length(): number {
        return this.data.length;
    }
}

// Linked List
export class LinkedList extends AbstractSorter {
    head: Node | null = null;

    add(data: number): void {
        const node = new Node(data);

        if (!this.head) {
            this.head = node;
            return;
        }

        let tail = this.head;
        while (tail.next) {
            tail = tail.next;
        }
        tail.next = node;
    }

    get length(): number {
        if (!this.head) {
            return 0;
        }

        let length = 1;
        let cur = this.head;
        while (cur.next) {
            cur = cur.next;
            length++;
        }
        return length;
    }

    at(index: number): Node {
        if (!this.head) {
            throw new Error('Index out of bound.');
        }

        let cur: Node | null = this.head;
        for (let i = 0; i < index; i++) {
            cur = cur.next;
            if (!cur) {
                throw new Error('Index out of bound.');
            }
        }

        return cur;
    }

    compare(leftIndex: number, rightIndex: number): boolean {
        if (!this.head) {
            throw new Error('List is empty');
        }
        return this.at(leftIndex).data > this.at(rightIndex).data;
    }

    swap(leftIndex: number, rightIndex: number): void {
        const leftNode = this.at(leftIndex);
        const rightNode = this.at(rightIndex);

        const leftHandData = leftNode.data;
        leftNode.data = rightNode.data;
        rightNode.data = leftHandData;
    }

    print(): void {
        if (!this.head) {
            return;
        }
        const values: number[] = [];
        let cur: Node | null = this.head;
        while (cur) {
            values.push(cur.data);
            cur = cur.next;
        }
        console.log(values);
    }
}
```
and the end usage becomes:
```typescript
const numbersCollectionSorter = new NumbersCollection([10, 3, -5, 0]);
console.log('Numbers Collection Sorter\n:', numbersCollectionSorter);
numbersCollectionSorter.sort();
console.log('Numbers Collection Sorter Sorted\n:', numbersCollectionSorter);

const charactersCollectionSorter = new CharactersCollection('AsDfGh');
console.log('Characters Collection Sorter:\n', charactersCollectionSorter);
charactersCollectionSorter.sort();
console.log('Characters Collection Sorter sorted:\n', charactersCollectionSorter);

const linkedListSorter = new LinkedList();
linkedListSorter.add(10);
linkedListSorter.add(3);
linkedListSorter.add(-5);
linkedListSorter.add(0);
console.log('Linked List Sorter:');
linkedListSorter.print();
linkedListSorter.sort();
console.log('Linked List Sorter sorted:');
linkedListSorter.print();
```

