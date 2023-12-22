import { ITodo } from "../ITodo";
import { ITodoActions } from "../ITodoActions";
import { TodoItem } from "../todo-item/todo-item";
import block from 'bem-cn-lite';

import './todo-list.css';

const b = block('todo-list');

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
        <div className={b()}>
            {todos
                .sort(todoCompare)
                .map(todo =>
                    <TodoItem key={todo.id} {...{ todo, todoActions, className: b('item') }} />
                )}
        </div>;

    return content;
}
