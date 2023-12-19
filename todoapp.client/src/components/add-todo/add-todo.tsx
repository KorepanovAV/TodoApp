import { MouseEventHandler, useId, useState } from "react";
import block from "bem-cn-lite";

import './add-todo.css';

export interface IAddTodo {
    text?: string;
    important?: boolean;
}

interface IAddTodoProps {
    onAddTodo: (todo?: IAddTodo) => void;
}

const b = block('add-todo');
const e = block('add-todo-element');

export function AddTodo(props: IAddTodoProps) {
    const { onAddTodo } = props;
    const checkboxLabelId = useId();
    const [form, setForm] = useState<IAddTodo>();
    const addClickHandler: MouseEventHandler = () => onAddTodo(form);

    return (
        <div className={b()} >
            <label className={b('text-label', e())} >Текст новой задачи:</label>
            <input className={b('text', e())} type="text" placeholder="Текст" onChange={(e) => setForm({ ...form, text: e.target.value })} />

            <input className={b('important', e())} type="checkbox" id={checkboxLabelId} onChange={(e) => setForm({ ...form, important: e.target.checked })} />
            <label className={b('important-label', e())} htmlFor={checkboxLabelId}>Задача важная</label>

            <input className={b('add-button', e())} type="button" value="Добавить" onClick={addClickHandler} />
        </div>
    );
}
