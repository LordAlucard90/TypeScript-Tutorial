interface MotorVehicle {
    name: string;
    year: number;
    broken: boolean;
}

interface Reportable {
    summery(): string;
}

const oldCivic = {
    name: 'civic',
    year: 2000,
    broken: true,
    summery(): string {
        return `Name ${this.name}`;
    },
};

const printVehicle = (vehicle: MotorVehicle): void => {
    console.log(`Name: ${vehicle.name}`);
    console.log(`Year: ${vehicle.year}`);
    console.log(`Broken? ${vehicle.broken}`);
};
printVehicle(oldCivic);

const printSummary = (item: Reportable): void => {
    console.log(item.summery());
};

printSummary(oldCivic);
