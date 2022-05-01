let value = 42; // number
console.log(`value is ${typeof value}`)
let otherValue = '42'; // string
console.log(`otherValue is ${typeof otherValue}`)

let uninitialized; // any
console.log(`uninitialized is ${typeof uninitialized}`)
uninitialized = true
console.log(`uninitialized is ${typeof uninitialized}`)

let numbers = [-10, -1, 12];
// even if it is possible doesn't mean that should be done
let numberAboveZero: boolean | number = false; // multiple type possible

for (let i = 0; i < numbers.length; i++) {
    if (numbers[i]) {
        numberAboveZero = numbers[i];
   }
}
console.log(`numberAboveZero is ${numberAboveZero} of type ${typeof numberAboveZero}`)


let obj: {[key: string]: number} = {
    "first": 1,
    "second": 2,
}
console.log(obj)

