import { ITodo } from "../ITodo";
import { ITodoActions } from "../ITodoActions";
import { TodoItem } from "../todo-item/todo-item";

import './todo-list.css';

interface ITodoListProps {
    todos: ITodo[];
    todoActions: ITodoActions;
    todoCompare: (l: ITodo, r: ITodo) => number;
}

export function TodoList(props: ITodoListProps) {
    const { todos, todoActions, todoCompare } = props;

    const content = todos === undefined
        ? <p><em>Loading...</em></p>
        :
        <div>
            {todos
                .sort(todoCompare)
                .map(todo =>
                    <TodoItem key={todo.id} todo={todo} todoActions={todoActions} />
                )}
        </div>;

    return content;
}
