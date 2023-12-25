import { MouseEventHandler, useId, useState } from "react";
import block from "bem-cn-lite";

import './add-todo.css';

export interface IAddTodo {
    text?: string;
    important?: boolean;
}

interface IAddTodoProps {
    className?: string;
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
            <div className={b('text')}>
                <label className={b('text-label', e())} >Текст новой задачи:</label>
                <input className={b('text-value', e())} type="text" placeholder="Текст" onChange={(e) => setForm({ ...form, text: e.target.value })} />
            </div>

            <div className={b('important')}>
                <input className={b('important-value', e())} type="checkbox" id={checkboxLabelId} onChange={(e) => setForm({ ...form, important: e.target.checked })} />
                <label className={b('important-label', e())} htmlFor={checkboxLabelId}>Задача важная</label>
            </div>

            <input className={b('add-button', e())} type="button" value="Добавить" onClick={addClickHandler} />
        </div>
    );
}
