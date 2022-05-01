const pepsiObj = {
    color: 'brown',
    carbonated: true,
    sugar: 40
}

// tuple definition #1
const pepsiTuple1: [string, boolean, number] = ['brown', true, 40];

// tuple definition #2
type Drink = [string, boolean, number]; // type alias
const pepsiTuple2: Drink = ['brown', true, 40];

