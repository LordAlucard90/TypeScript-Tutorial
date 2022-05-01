enum DefaultDirection {
    Up, // 0
    Down, // 1
    Left, // 2
    Right, // 3
}
console.log(Object.keys(DefaultDirection));
console.log(0 as DefaultDirection)

enum NumberDirection {
    Up = 1,
    Down, // 2
    Left, // 3
    Right, // 4
}
console.log(Object.keys(NumberDirection));
console.log(2 as NumberDirection)

enum StringDirection {
    Up = 'UP',
    Down = 'DOWN',
    Left = 'LEFT',
    Right = 'RIGHT',
}
console.log(Object.keys(StringDirection));
console.log('UP' as StringDirection)
