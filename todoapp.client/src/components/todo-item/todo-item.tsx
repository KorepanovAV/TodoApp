import { ITodo } from "../ITodo";
import { ITodoActions } from "../ITodoActions";
import block from 'bem-cn-lite';

import './todo-item.css';

const b = block('todo-item');

interface ITodoItemProps {
    todo: ITodo;
    todoActions: ITodoActions;
}

export function TodoItem(props: ITodoItemProps) {
    const { todo, todoActions: { onTodoDelete, onTodoPerform, onTodoToWork } } = props;

    const importanceMark = todo.important
        ? <span className={b('important')}>!</span>
        : <span className={b('important')}>&nbsp;</span>;

    const actionButton = todo.done
        ? <input type="button" value="Вернуть в работу" onClick={() => onTodoToWork(todo)} />
        : <input type="button" value="Выполнить" onClick={() => onTodoPerform(todo)} />;

    return (
        <>
            <div className={b()} >
                {importanceMark}&nbsp;
                <a href={`#/todo/${todo.id}`}>{todo.text}</a>&nbsp;
                {actionButton}&nbsp;
                <input type="button" value="Удалить" onClick={() => onTodoDelete(todo)} />
            </div>
        </>
    );
}
