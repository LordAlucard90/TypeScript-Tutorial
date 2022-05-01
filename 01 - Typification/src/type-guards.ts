let possibleNull: string | undefined = 'something';

if (possibleNull) {
    possibleNull.toUpperCase(); // now this operation is safe
}

let variableDate: string | Date = new Date();
if (variableDate instanceof Date) {
    // date methods are accessible in this scope
    console.log(variableDate.getHours(), variableDate.getMinutes());
}
variableDate = "2020-02-02"
if (typeof variableDate === 'string') {
    // string methods are accessible in this scope
    console.log(variableDate.split("-"));
}

