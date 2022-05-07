import React from 'react';
import { connect } from 'react-redux';
import { deleteTodo, Todo } from '../actions';
import { StoreState } from '../reducers';
import { fetchTodos } from '../actions';

interface AppProps {
    todos: Todo[];
    // fetchTodos: typeof fetchTodos; // breaks the connect definition
    fetchTodos: Function;
    deleteTodo: typeof deleteTodo;
}

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

// const mapStateToProps = (state: StoreState): { todos: Todo[] } => {
//     return { todos: state.todos };
// }
const mapStateToProps = ({ todos }: StoreState): { todos: Todo[] } => {
    return { todos };
};

export const App = connect(mapStateToProps, { fetchTodos, deleteTodo })(_App);
