import faker from '@faker-js/faker';
import { Mappable } from './CustomMap';

export class User implements Mappable {
    name: string;
    location: {
        lat: number;
        lon: number;
    };
    color: string = 'red';

    constructor() {
        this.name = faker.name.findName();
        this.location = {
            lat: parseFloat(faker.address.latitude()),
            lon: parseFloat(faker.address.longitude()),
        };
    }

    markerContent(): string {
        return `
            <div>
                <p>User Name: ${this.name}</p>
            </div>
        `;
    }
}
