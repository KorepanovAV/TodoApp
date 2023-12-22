import { ITodo } from "../ITodo";
import { ITodoActions } from "../ITodoActions";
import block from 'bem-cn-lite';

import './todo-item.css';

const b = block('todo-item');

interface ITodoItemProps {
    className?: string;
    todo: ITodo;
    todoActions: ITodoActions;
}

export function TodoItem(props: ITodoItemProps) {
    const { todo, className, todoActions: { onTodoDelete, onTodoPerform, onTodoToWork } } = props;

    const actionProps = {
        value: todo.done ? "Вернуть в работу" : "Выполнить",
        onClick: todo.done ? () => onTodoToWork(todo) : () => onTodoPerform(todo),
    };

    return (
        <>
            <div className={b(null, className)} >
                <div className={b('importance')} >{todo.important ? '⚡' : ''}</div>
                <a className={b('text')} href={`#/todo/${todo.id}`}>{todo.text}</a>
                <input className={b('action-button', { 'size': true })} type="button" {...actionProps} />
                <input className={b('delete-button')} type="button" value="Удалить" onClick={() => onTodoDelete(todo)} />
            </div>
        </>
    );
}
