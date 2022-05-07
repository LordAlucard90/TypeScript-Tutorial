# React And Redux

## Content

- [Setup](#setup)
- [Props](#props)
- [Functional Components](#functional-components)
- [Redux](#redux)

---

## Setup

A React project can be initialized with:
```bash
npx create-react-app example --template typescript
```
by default there are a lot of files automatically generated,
for this tutorial all of them will be deleted but the `index.tsx` and the `public`
directory.

The initial app structure will be:
```typescript
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    render() {
        return <div>Hi</div>;
    }
}
ReactDOM.render(<App />, document.querySelector('#root'));
```
the app can be started with:
```bash
cd example
npm start
```
and is available at [http://localhost:3000/](http://localhost:3000/).

## Props

It is possible to define properties passed to a component using interfaces:
```typescript
interface AppProps {
    color: string; // can be also optional
}

class App extends React.Component<AppProps> {
    render() {
        return <div>{this.props.color}</div>;
    }
}
ReactDOM.render(<App color='red' />, document.querySelector('#root'));
```

## Local State

It is possible to add the state to the component just redefininig 
the state definition:
```typescript
class App extends React.Component<AppProps> {
    state = { counter: 0 }; // redefines the state

    onIncrement = (): void => {
        this.setState({ counter: this.state.counter + 1 });
    };

    onDecrement = (): void => {
        this.setState({ counter: this.state.counter - 1 });
    };

    render() {
        return (
            <div>
                <button onClick={this.onIncrement}>Increment</button>
                <button onClick={this.onDecrement}>Decrement</button>
                {this.state.counter}
            </div>
        );
    }
}
```

Or, using the constructur, adding it explicitely in the generic component
definition:
```typescript
interface AppState {
    counter: number;
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = { counter: 0 };
    }

    // ...
}
```

## Functional Components

A react functional component can be defined as follow:
```typescript
interface AppProps {
    color?: string;
}

const App = (props: AppProps): JSX.Element => {
    return <div>{props.color}</div>;
};

ReactDOM.render(<App color="red" />, document.querySelector('#root'));
``` 

## Redux

The main dependencies to be installed are:
```
npm i redux react-redux redux-thunk 
npm i @types/react-redux // redux and redux-thunk type definition files are already included
npm i axios @types/axios
```
the basic code setup is:
```typescript
// reducers
export const reducers = combineReducers({
    counter: () => 1
})

// index
const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('#root'),
);
```

### Actions

```typescript
export enum ActionTypes {
    fetchTodos // 0 as default value is enough
}

const url = `https://jsonplaceholder.typicode.com/todos`;

export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

export interface FetchTodosAction {
    type: ActionTypes.fetchTodos;
    payload: Todo[];
}

export const fetchTodos = () => {
    return async (dispatch: Dispatch) => {
        // check resopnse format
        const response = await axios.get<Todo[]>(url);

        // check dispatch type
        dispatch<FetchTodosAction>({
            type: ActionTypes.fetchTodos,
            payload: response.data,
        });
    };
};
```

### Reducers

Specialized reducer:
```typescript
export const todosReducer = (state: Todo[] = [], action: FetchTodosAction): Todo[] => {
    switch (action.type) {
        case ActionTypes.fetchTodos:
            return action.payload;
        default:
            return state;
    }
};
```
app level reducer:
```typescript
// checks that the reducers return always the correct data
export interface StoreState {
    todos: Todo[]
}

export const reducers = combineReducers<StoreState>({
    todos: todosReducer
})
```

### Component Integration

Redux can be integrated inside a class component in this way:
```typescript
interface AppProps {
    todos: Todo[];
    fetchTodos(): any;
}

export class _App extends React.Component<AppProps> {
    onButtonClick = (): void => {
        this.props.fetchTodos();
    };

    renderList(): JSX.Element[] {
        // return this.props.todos.map(todo => { // type is inferred automatically
        return this.props.todos.map((todo: Todo) => {
            return <div key={todo.id}>{todo.title}</div>;
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.onButtonClick}>Fetch</button>
                {this.renderList()}
            </div>
        );
    }
}

// const mapStateToProps = (state: StoreState): { todos: Todo[] } => {
//     return { todos: state.todos };
// }
const mapStateToProps = ({ todos }: StoreState): { todos: Todo[] } => {
    return { todos };
};

export const App = connect(mapStateToProps, { fetchTodos })(_App);
```

### Generalize Actions

To delete a todo a new action is needed:
```typescript
export enum ActionTypes {
    fetchTodos,
    deleteTodo,
}

export interface DeleteTodoAction {
    type: ActionTypes.deleteTodo;
    payload: number;
}

export const deleteTodo = (id: number): DeleteTodoAction => {
    return {
        type: ActionTypes.deleteTodo,
        payload: id,
    };
};
```
since the possible action grows fast it is necessary to create a new type
```typescript
export type Action = FetchTodosAction | DeleteTodoAction;
```
this new type can be used in the reducer definition;
```typescript
export const todosReducer = (state: Todo[] = [], action: Action): Todo[] => {
    switch (action.type) {
        case ActionTypes.fetchTodos: // this is a type guard for the Action actual state
            return action.payload; // payload can only be Todo[]
        case ActionTypes.deleteTodo: // this is a type guard for the Action actual state
            return state.filter((todo: Todo) => todo.id !== action.payload); // payload can only be number
        default:
            return state;
    }
};
```
The new action can be integrated in the componenet in this way:
```typescript
interface AppProps {
    todos: Todo[];
    // fetchTodos: typeof fetchTodos; // breaks the connect definition
    fetchTodos: Function;
    deleteTodo: typeof deleteTodo;
}

export class _App extends React.Component<AppProps> {
    onButtonClick = (): void => {
        this.props.fetchTodos();
    };

    onTodoClick = (id: number): void => {
        this.props.deleteTodo(id);
    };

    renderList(): JSX.Element[] {
        // return this.props.todos.map(todo => { // type is inferred automatically
        return this.props.todos.map((todo: Todo) => {
            return (
                <div onClick={this.onTodoClick.bind(this, todo.id)} key={todo.id}>
                    {todo.title}
                </div>
            );
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.onButtonClick}>Fetch</button>
                {this.renderList()}
            </div>
        );
    }
}

// const mapStateToProps = (state: StoreState): { todos: Todo[] } => {
//     return { todos: state.todos };
// }
const mapStateToProps = ({ todos }: StoreState): { todos: Todo[] } => {
    return { todos };
};

export const App = connect(mapStateToProps, { fetchTodos, deleteTodo })(_App);
```

### Tracking Loading

Normally this part should be done with redux, but a quick example with the state is:
```typescript
interface AppState {
    fetching: boolean;
}

export class _App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = { fetching: false };
    }

    componentDidUpdate(prevProps: AppProps): void {
        // if todos has been fetched
        if (!prevProps.todos.length && this.props.todos.length) {
            this.setState({ fetching: false });
        }
    }

    onButtonClick = (): void => {
        this.props.fetchTodos();
        this.setState({ fetching: true });
    };

    onTodoClick = (id: number): void => {
        this.props.deleteTodo(id);
    };

    renderList(): JSX.Element[] {
        // return this.props.todos.map(todo => { // type is inferred automatically
        return this.props.todos.map((todo: Todo) => {
            return (
                <div onClick={this.onTodoClick.bind(this, todo.id)} key={todo.id}>
                    {todo.title}
                </div>
            );
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.onButtonClick}>Fetch</button>
                {this.state.fetching ? 'LOADING' : null}
                {this.renderList()}
            </div>
        );
    }
}
```

