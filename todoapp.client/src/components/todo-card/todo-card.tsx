import { useEffect, useId, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { ITodo } from "../ITodo";

import './todo-card.css';

export function TodoCard() {
    const params = useParams<{ id: string }>();
    const id: number = Number(params.id);
    const [todo, setTodo] = useState<ITodo>();
    const [form, setForm] = useState<{ text?: string, important?: boolean, done?: boolean }>({});

    const [textId, importantId, doneId] = [useId(), useId(), useId()];

    useEffect(() => {
        getTodo(id);
        setForm({ ...todo });
    }, [id, todo]);

    return (
        <div>
            <div><NavLink to="/">Вернуться в список</NavLink></div>
            <form>
                <div>
                    <label htmlFor={textId}>Текст задачи:</label>
                    <input id={textId} type="text" defaultValue={todo?.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
                </div>
                <div>
                    <input id={importantId} type="checkbox" defaultChecked={todo?.important} onChange={(e) => setForm({ ...form, important: e.target.checked })} />
                    <label htmlFor={importantId}>Задача важная</label>
                </div>
                <div>
                    <input id={doneId} type="checkbox" defaultChecked={todo?.done} onChange={(e) => setForm({ ...form, done: e.target.checked })} />
                    <label htmlFor={doneId}>Выполнена</label>
                </div>
                <div>
                    <input type="submit" value="Сохранить" onClick={() => updateTodo(id, form.text, form.important, form.done)} />
                </div>
            </form>
        </div>
    );

    async function getTodo(id: number) {
        const response = await fetch(`api/todos/${id}`);
        const data = await response.json() as ITodo;
        setTodo(data);
    }

    async function updateTodo(id: number, text?: string, important?: boolean, done?: boolean) {
        const body = JSON.stringify({ text, important, done });
        await fetch(`api/todos/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", }, body });
        await getTodo(id);
    }
}
