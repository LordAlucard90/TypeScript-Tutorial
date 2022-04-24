# Best Practices

## Content

- [Parcel Bundler](#parcel-bundler)
- [Class Files](#class-files)
- [Faker](#faker)
- [Google Maps Api](#google-maps-api)
- [Data Hiding](#data-hiding)
- [Generalization](#generalization)

---

## Parcel Bundler

It is a command line tool to run typescript code inside the browser easily.
```bash
sudo npm i -g parcel-bundler
```
It allows to run our application using:
```bash
parcel index.html 
```

## Class Files

files used to define a class should have the fist letter uppercase, while other 
generic files just lowercase.

```typescript
// User.ts
export class User {

}

// index.ts
import {User} from './User';

const user = new User();
```

Normally in the typescript world it is not used the `default`
statement for exporting stuff.


## Faker

[Faker](https://fakerjs.dev/) is an handy tool to automatically generate fake data.

```bash
npm i @faker-js/faker
```

Javascript module used inside Typescript can do not have a type definition file
used from Typescript to fully understand how to use it.
It is possible to manually install the definition files.
There are already a lot of files defined at `@types/<library_name>`,
they are files define as `<library_name>.d.ts` are contains only types definitions.
It is enough to import them for `faker` it is `@types/faker`:
```bash
npm i @types/faker
```

```typescript
this.name = faker.name.findName();
this.companyName = faker.company.companyName();
this.catchPhrase = faker.company.catchPhrase();
this.location = {
    lat: parseFloat(faker.address.latitude()),
    lon: parseFloat(faker.address.longitude()),
};
```

## Google Maps Api

In order to use the Google Maps apis it is necessaty to create a 
Google Dev Project.

Since the google maps script creates a global variable available to all project,
but typescript is not aware of it, it is possible to make it aware using the 
definition file:
```bash
npm i @types/google.maps
```

## Data Hiding

In order to avoid wrong use of our class, it is a good practice to wrap the
google maps class inside a `CustomMap` one, so that only the methods that
we want to expose are accessible:

```typescript
export class CustomMap {
    private googleMap: google.maps.Map;

    constructor(elementId: string) {
        this.googleMap = new google.maps.Map(/* ... */);
    }

    // ...
}
```

## Generalization

In order to avoid code duplication it is a best practice to create interfaces
to use as argument type:
```typescript
export interface Mappable {
    location: {
        lat: number;
        lon: number;
    };
    markerContent(): string;
    color: string;
}

export class CustomMap {
    // ...

    addMarker(mappable: Mappable): void {
        // ...
    }
}


export class User implements Mappable {
    // ...
}

export class Company implements Mappable {
    // ...
}
```

