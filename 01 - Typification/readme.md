# Typification

## Content

- [Types](#types)
- [Type Annotation](#type-annotation)
- [Type Inference](#type-inference)
- [Any](#any)
- [Functions](#functions)
- [Destructuring](#destructuring)
- [Arrays](#arrays)
- [Tuples](#tuples)
- [Enums](#enums)
- [Interfaces](#interfaces)
- [Classes](#classes)
- [Generics](#generics)

---

## Types

There are two king of data types:
- primitive types
    - number
    - string
    - boolean
    - symbol
    - void
    - null
    - undefined
- object types
    - function
    - class
    - object
    - array

## Type Annotation

A type annotation is a peace of code used to define the type of a variable.

Primitive types type can be declare in this way:

```typescript
let value: number = 42;
// const value: boolean = 7; returns an error
value = 24;
// value = '33'; returns an error
```

Objects types can be declared with this syntax:

```typescript
// Arrays
let colors: string[] = ['red', 'green', 'blue'];

// Classes
class Car {}
let car: Car = new Car();

// Literals
let point: { x: number; y: number } = {
    x: 10,
    y: 20
}

// function
cosnt logNumber: (i: number) => void = (i: number) => {
    console.log(i)
}

```


## Type Inference

Type inference is used by TypeScript to automatically infer the type of a variable
by itself.

For primitive types, the type can be inferred in this way:

```typescript
let value = 42; // number
let otherValue = '42'; // string

let uninitialized; // any
uninitialized = true
```

TypeScript is able to infer the type only when the variable is initialized 
and declared at the same time,
Otherwise it will use the type `any`.

## Any

By default if TypeScript does not know the type of a response, 
it will use the any type.

#### Function Return Type

```typescript
const json = '{"x":10, "y":20}';
const coordinates = JSON.parse(json);
// coordinates is of type any
console.log(coordinates)
```

It is possible to tell TypeScript the response type using:

```typescript
const json = '{"x":10, "y":20}';
const coordinates: { x: number; y: number } = JSON.parse(json);
console.log(coordinates)
```

#### Variable Declaration

It is possible to force the type declaring it explicitly

```typescript
let value; // any
let value: number; // number
```

#### Hard Variable Declaration

```typescript
let numbers = [-10, -1, 12];
let numberAboveZero = false;

for (let 1 = 0; i < numbers.length; i++) {
    if (numbers[i]) {
        // don't do, just an example
        numberAboveZero = numbers[i]; // this gives an error
   }
}
```

The code above can be fixed in the fallowing way:

```typescript
let numbers = [-10, -1, 12];
// even if it is possible doesn't mean that should be done
let numberAboveZero: boolean | number = false; // multiple type possible

for (let 1 = 0; i < numbers.length; i++) {
    if (numbers[i]) {
        numberAboveZero = numbers[i];
   }
}
```

#### Generic Object

A generic object, can be mapped specifying the key and value type:
```typescript
let obj: {[key: string]: number} = {
    "first": 1,
    "second": 2,
}
```

## Functions

For function TypeScript will try to understand the type of the return,
but not the type of the arguments. 

The basic annotation is:
```typescript
// add takes two number and returns a number
const add = (a: number, b: number): number => {
    return a + b;
}
// the return type is automatically inferred
const addInferred = (a: number, b: number) => {
    return a + b;
}
// with no return the void is inferred
const addInferred = (a: number, b: number) => {
    // 
}
```

The `void` keyword means that no return is expected:
```typescript
const logger = (message: string): void {
    console.log(message);
}
```

The `never` keyword indicates that the end of the function will never be reached:
```typescript
const error = (message: string): never {
    throws new Error(message);
}
```


## Destructuring

The function argument destructuring can be done in this way:
```typescript
const todaysForecast = {
    date: new Date(),
    weather: 'sunny'
};

// without destructuring
const logWeather = (forecast: {date: Date, weather: string}): void => {
    console.log(forecast.date);
    console.log(forecast.weather);
};

// with destructuring
const logWeather = ({ date, weather }: {date: Date, weather: string}): void => {
    console.log(date);
    console.log(weather);
};


logWeather(todaysForecast)
```

For object destructuring it can be done in this way:
```typescript
const profile = {
    name: 'Pippo',
    age: 20,
    coordinates: {
        latitude: 42,
        longitude: 24,
    },
    setAge(age: number): void {
        this.age: age;
    }
}

const { age }: {age: number} = profile;
const { age, name }: {age: number, name: string} = profile;
const {
    coordinates: {latitude, longitude}
}: {coordinates: {latitude: number, longitude: number}} = profile
```

## Arrays

```typescript
// definition
const colors = ['red', 'green', 'blue']; // string[]
const colors = []; // any[]
const colors: string[]; // string[]
const colors: string[] = []; // string[]

// usage
const firstColor = colors[0] // string
const firstColor = colors.pop() // string
// colors.push(123) gives an error
colors.map((color: string): string => {
    return color.toUpperCase();
});
```

A multi-type array can be declarade in this way:
```typescript
const multipleDates = [new Date(), '1970-01-01'] // (Date | string)[] 
const multipleDates: (Date | string)[] = [new Date(), '1970-01-01'] // (Date | string)[] 
const multipleDates: (Date | string)[] = [new Date()] // (Date | string)[] 
```

## Tuples

A tuple is an array with a specific order of elements that has a fixed meaning.

```typescript
const pepsiObj = {
    color: 'brown',
    carbonated: true,
    sugar: 40
}

// tuple definition #1
const pepsiTuple: [string, boolean, number] = ['brown', true, 40];

// tuple definition #2
type Drink = [string, boolean, number]; // type alias
const pepsiTuple: Drink = ['brown', true, 40];
```

Tuples are useful in context like csv definition.

## Enums

Enums are used to define a set of named constants,
they should be used only for small sets of static values.

By default enums are numeric and can be defined in this way:
```typescript
enum Direction {
  Up,         // 0
  Down,       // 1
  Left,       // 2
  Right,      // 3
}
```
if the first value is explicitly set, the others will follow incrementally:
```typescript
enum Direction {
  Up = 1,
  Down,       // 2
  Left,       // 3
  Right,      // 4
}
```
all the members can be initialized whit the desired values:
```typescript
enum UserResponse {
  No = 0,
  Yes = 1,
}
```
the values can also be the result of some calculation, but coputed values
must be at the end:
```typescript
enum Enum { // not ok
  A = getSomeValue(),
  B,
}
enum Enum { // ok
  A,
  B = getSomeValue(),
}
```
enums can be defined also al strings:
```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```
or with mixed values:
```typescript
enum MixedResponse {
  No = 0,
  Yes = "YES",
}
```
thier values can be revese mapped:
```typescript
enum Enum {
  A,
}
 
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```
Values can be converted to enums using the type assertion:
```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
var directionString = "UP"
var direction = directionString as Direction
```

## Interfaces

An interface is a new type available in the application.
```typescript
interface Vehicle {
    name: string; 
    year: number;
    broken: boolean
}

const oldCivic = { // valid Vehicle
    name: 'civic',
    year: 2000,
    broken: true
};

const printVehicle = (vehicle: Vehicle): void => {
    console.log(`Name: %{vehicle.name}`);
    console.log(`Year: %{vehicle.year}`);
    console.log(`Broken? %{vehicle.broken}`);
}

printVehicle(oldCivic);
```

Interface can also include method declarations like:
```typescript
interface Reportable {
    summery() : string;
}

const oldCivic = { // valid Vehicle
    name: 'civic',
    year: 2000,
    broken: true,
    summery(): string {
        return `Name %{this.name}`;
    }
};

const printSummary = (item: Reportable): void => {
    console.log(item.summery());
}

printSummary(oldCivic);
```

## Classes

The scope of a class is to introduce a new type and add functionality:
```typescript
class Vehicle {
    drive(): void {
        console.log("Brummmmm");
    }.
    honk(): void {
        console.log("Beeep");
    },
}

const vehicle = new Vehicle();
vehicle.drive();
vehicle.honk();
```

Classes allows to use inheritance:
```typescript
class Vehicle {
    drive(): void {
        console.log("Brummmmm");
    }.
    honk(): void {
        console.log("Beeep");
    },
}

class Car extends Vehicle { // inheritance
    drive(): void {
        console.log("Vrum Vrum");
    }.
}

const car = new Car();
car.drive(); // uses the car implementation
car.honk(); // uses the vehicle implementation
```

Methods has access modifiers:
- `public`, default, everyone can access
- `private`, only method inside the class can access
- `protected`, only method inside the class and its children can access

The child class can not change the modifier of the parent.

#### Constructor

```typescript
class Vehicle {
    // property and constructor definition #1
    color: string = 'red';
    year: number;

    constructor(year: number) {
        this.year = year;
    }

    // property and constructor definition #2
    constructor(public year: number, public color: string = red) { // TODO check
    }

    // methods
    drive(): void {
        console.log("Brummmmm");
    }.
    honk(): void {
        console.log("Beeep");
    },
}
```

Child classes can have no constructors, the constructor is taken automatically 
equal to the base class, or define their own, in this case they must call 
the super method with the required parameters of the base one:
```typescript
class Vehicle {
    constructor(public color: string){}
}

// case #1
class Car extends Vehicle {}
const cat = new Car("black");

// case #2
class Motorbike extends Vehicle {
    constructor(color: string){
        super(color);
    }
}
const motorbike = new Motorbike("red");
```

### Interfaces Extension

A class can extend an interface, it must define all ies methods:
```typescript
interface Vehicle {
    color: string;
    drive(): void;
}

class Car implements Vehicle {
    constructor(public color: string){}

    drive() {
        console.log("Bruuuuuum!");
    }
}

class Motorbike implements Vehicle {
    color = "red";

    drive() {
        console.log("Breeeeeem!");
    }
}

const car = new Car("black");
car.drive()

const motorbike = new Motorbike();
motorbike.drive()
```

### Abstract Classes

An abstract class is like a class but can define methods and values that will
be implemented by the derived classes:
```typescript
abstract class Vehicle {
    color: string = "red";
    abstract year: number;
    abstract drive(): void;
    honk(): void {
        console.log("Beeeep!");
    }
}

class Car extends Vehicle {
    constructor(public color: string, public year: number){
        super()
    }

    drive() {
        console.log("Bruuuuuum!");
    }

    honk() {
        console.log("boooop!")
    }
}

class Motorbike extends Vehicle {
    year = 2001;

    drive() {
        console.log("Breeeeeem!");
    }
}

const car = new Car("black", 1999);
car.drive()
car.honk()

const motorbike = new Motorbike();
motorbike.drive()
motorbike.honk()
```

### Accessors

TODO get set 

### Static Class Members

Static class members, are members that can be called without creatins a new 
class instance:
```typescript
class DateContainer {
    static CREATION = new Date();

    static now(): Date {
        return new Date();
    }
}

console.log(DateContainer.CREATION);
console.log(DateContainer.now());
```

## Generics

Generics are a powerful way to reuse code and logic 
across different implementations.

### Generic Classes

Taking as example two similar classes:
```typescript
class ArrayOfNumbers {
    constructor(public collection: number[]){}

    get(index: number): number {
        return this.collection[index];
    }
}
const arrayOfNumbers = new ArrayOfNumbers([1, 2, 3]);

class ArrayOfStrings {
    constructor(public collection: string[]){}

    get(index: number): string {
        return this.collection[index];
    }
}
const arrayOfStrings = new ArrayOfStrings(["a", "b", "c"]);
```
The generic equivalent implementation is:
```typescript
class ArrayOfAnything<T> {
    constructor(public collection: T[])

    get(index: number): T {
        return this.collection[index];
    }
}
const arrayOfStrings = new ArrayOfAnything<string>(["a", "b", "c"]);
const arrayOfNumbers = new ArrayOfAnything<number>([1, 2, 3]);
```
TypeScript is able to automatically infer the type of the generic:
```typescript
const arrayOfStrings = new ArrayOfAnything<string>(["a", "b", "c"]); // ArrayOfAnything<string>
const arrayOfStrings = new ArrayOfAnything(["a", "b", "c"]); // ArrayOfAnything<string>
```

### Generic Functions

Like for classes, also for following functions:
```typescript
function printStrings(arr: string[]): void {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}
printStrings(["a", "b", "c"]);

function printNumbers(arr: number[]): void {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}
printNumbers([1, 2, 3]);
```
it is possible to inplement the generic version:
```typescript
function printAnything<T>(arr: T[]): void {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}
printAnything<number>([1, 2, 3]);
printAnything<string>(["a", "b", "c"]);
```
As for the class, the type is automatically inferred:
```typescript
printAnything<number>([1, 2, 3]); // T = number
printAnything([1, 2, 3]); // T = number
```

### Type Constraints

By default a generic parameter can be anything.
However it is possible to speciry some limitation on the classes that can 
be used by the generic class or method to be able to access more properties:
```typescript
interface Printable {
    print(): void;
}

class Car implements Printable {
    print() {
        console.log("I'm a Car!");
    }
}

class House implements Printable {
    print() {
        console.log("I'm an House!");
    }
}

// not valid implementation
// function printHousesOrCars<T>(arr: T[]): void {
//     for (let i = 0; i < arr.length; i++) {
//         arr[i].print(); // unknown property
//     }
// }

// valid implementation
function printHousesOrCars<T extends Printable>(arr: T[]): void {
    for (let i = 0; i < arr.length; i++) {
        arr[i].print();
    }
}

// valid usages
printHousesOrCars<House>([new House(), new House()])
printHousesOrCars<Car>([new Car(), new House()])
printHousesOrCars([new House(), new House()])
printHousesOrCars([new Car(), new Car()])
printHousesOrCars([new Car(), new House()])

// invalid usages
// printHousesOrCars<House>([new Car(), new House()])
// printHousesOrCars<Car>([new Car(), new House()])
```

### Dynamic Return

Given a generic class and a get attribute method that retrieves one of the values
of the composed object, it is possible to infer the return type in this way:
```typescript
class Composed {
    aNumber: number;
    aString: string;
}

export class DynamicGetter<T> {
    constructor(private data: T){}

    get<K extends keyof T>(key: K): T[K] {
        return this.data[key];
    }
}

const getter = new DynamicGetter<Composed>({
    aNumber: 42,
    aString: "example",
})

const aNumber: number = getter.get("aNumber")
const aString: string = getter.get("aString")
```



