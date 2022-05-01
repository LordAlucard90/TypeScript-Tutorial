interface Vehicle {
    color: string;
    year: number;
    drive(): void;
}

enum Color {
    R = 'red',
    G = 'green',
    B = 'blue',
}

abstract class MotorVehicle implements Vehicle {
    color: string;
    seats: number = 4; // public and default value
    abstract wheels: number;

    constructor(
        public year: number, // automatically set
        color: string = 'red', // must be assigned explicitly and has a default value
    ) {
        this.color = color.toLowerCase();
    }

    // methods
    drive(): void {
        console.log('Brummmmm');
    }

    abstract honk(): void;

    get colorEnum(): Color {
        return this.color as Color;
    }

    set colorEnum(color: Color) {
        this.color = color.toString();
    }
}

class Car extends MotorVehicle {
    wheels: number = 4;

    // inheritance
    drive(): void {
        console.log('Vrum Vrum');
    }

    honk(): void {
        console.log('Beeep');
    }
}

class Motorbike extends MotorVehicle {
    seats: number = 2;

    constructor(year: number, public wheels: number) {
        super(year, 'green');
    }

    honk(): void {
        console.log('Beeep');
    }
}

class UniquePieceVehicle extends MotorVehicle {
    private static INSTANCE = new UniquePieceVehicle() 

    public static getInstance(): UniquePieceVehicle {
        return this.INSTANCE;
    }

    wheels: number = 5;
    private constructor() {
        super(1969, 'red');
    }

    honk(): void {
        console.log('Buuuuup');
    }
}

const car = new Car(2020);
console.log('Car');
car.drive(); // uses the car implementation
car.honk(); // uses the vehicle implementation
console.log(car.year);
console.log(car.color);
console.log(car.seats);
console.log(car.wheels);
console.log(car.colorEnum);
car.colorEnum = Color.G;
console.log(car.colorEnum);
console.log(car.color);

const car2 = new Car(2021, 'BLUE');
console.log('Car 2');
console.log(car2.year);
console.log(car2.color);
console.log(car2.seats);
console.log(car2.wheels);

const motorbike = new Motorbike(2023, 2);
console.log('Motorbike');
motorbike.drive(); // uses the vehicle implementation
motorbike.honk(); // uses the motorbike implementation
console.log(motorbike.year);
console.log(motorbike.color);
console.log(motorbike.seats);
console.log(motorbike.wheels);
