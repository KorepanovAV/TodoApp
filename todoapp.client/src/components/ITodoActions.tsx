import { ITodo } from './ITodo';

export interface ITodoActions {
    onTodoDelete: (todo: ITodo) => void;
    onTodoPerform: (todo: ITodo) => void;
    onTodoToWork: (todo: ITodo) => void;
}
