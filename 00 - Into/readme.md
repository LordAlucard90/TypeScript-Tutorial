# Intro

## Content 

- [The Type System](#the-type-system)
- [Installation](#installation)
- [First Example](#first-example)
- [Adding Types](#adding-types)

## The Type System

TypeScript only add a development superset to Javascript, it's porpoise is:
- catch errors during development
- use type annotations to analyze the code
- is active only during development
- does not provides performance optimizations

The TypeScript code is compiled by its compiler to plain Javascript code.

It is possible to play with TypeScript online with 
[typescriptlang](https://www.typescriptlang.org/play).

## Installation

```bash
sudo npm i -g typescript
sudo npm i -g ts-node
```
`ts-node` is a command line tool used to compile and run typescript in the terminal.

## First Example

Some fake data is provided by [jsonplaceholder](https://jsonplaceholder.typicode.com/).

A new project can be created with the command:
```bash
npm init
npm install axios
npm i @types/node --save-dev -- problems with the ts-node command
touch index.ts
```

Is is possible now populate the `index.ts` file with simple code:
```ts
import axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/todos/1';

axios.get(url).then(response => {
    const data = response.data;

    const id = data.id;
    const title = data.title;
    const finished = data.completed;

    console.log(`
                    The todo's data:
                        - id: ${id}
                        - title: ${title}
                        - finished: ${finished}
                    `);
});
```

and compile it to js with the command:
```bash
tsc index.ts
```
that will create a `index.js` file,\
and run the just create file using:
```js
node index.js
```

It is also possible to run all in one command with:
```bash
ts-node index.ts
```

## Adding Types

TypeScript allows to improve the type check in this way:
```typescript
import axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/todos/1';

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

axios.get(url).then(response => {
    const data = response.data as Todo;
    // console.log(data)
    const id = data.id;
    const title = data.title;
    const finished = data.completed;
    logTodo(id, title, finished);
});

const logTodo = (id: number, title: string, finished: boolean) => {
    console.log(`
                    The todo's data:
                        - id: ${id}
                        - title: ${title}
                        - finished: ${finished}
                    `);
};

```

