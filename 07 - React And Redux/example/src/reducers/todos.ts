import { Todo, ActionTypes, Action } from '../actions';

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
