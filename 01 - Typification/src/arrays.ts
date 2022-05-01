// definition
const colors1 = ['red', 'green', 'blue']; // string[]
const colors2 = []; // any[]
let colors3: string[]; // string[]
const colors4: string[] = []; // string[]

// usage
const firstColor1a = colors1[0] // string
const firstColor1b = colors1.pop() // string
// colors.push(123) gives an error
colors1.map((color: string): string => {
    return color.toUpperCase();
});

const multipleDates1 = [new Date(), '1970-01-01'] // (Date | string)[] 
const multipleDates2: (Date | string)[] = [new Date(), '1970-01-01'] // (Date | string)[] 
const multipleDates3: (Date | string)[] = [new Date()] // (Date | string)[] 

