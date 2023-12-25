import { useEffect, useId, useState, useRef } from "react";
import { NavLink, useParams } from "react-router-dom";
import { ITodo } from "../ITodo";
import { Header } from "../header/header";
import { Content } from "../content/content";
import block from 'bem-cn-lite';

import './todo-card.css';

const b = block('todo-card');

export function TodoCard() {
    const params = useParams<{ id: string }>();
    const id: number = Number(params.id);
    const [todo, setTodo] = useState<ITodo>();

    const [textId, importantId, doneId] = [useId(), useId(), useId()];
    const [textRef, importantRef, doneRef] = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    useEffect(() => {
        getTodo(id);
    }, [id, todo]);

    return (
        <div className={b()}>
            <Header>
                <NavLink className={b('return-back')} to="/">Вернуться в список</NavLink>
            </Header>

            <Content>
                <div className={b('card')}>
                    <label className={b('text-label')} htmlFor={textId}>Текст задачи:</label>
                    <div className={b('props')}>
                        <div>
                            <input id={textId} type="text" defaultValue={todo?.text} ref={textRef} />
                        </div>
                        <div>
                            <input id={importantId} type="checkbox" defaultChecked={todo?.important} ref={importantRef} />
                            <label htmlFor={importantId}>Задача важная</label>
                        </div>
                        <div>
                            <input id={doneId} type="checkbox" defaultChecked={todo?.done} ref={doneRef} />
                            <label htmlFor={doneId}>Выполнена</label>
                        </div>
                        <div>
                            <input type="button" value="Сохранить" onClick={() => updateTodo(id, textRef.current?.value, importantRef.current?.checked, doneRef.current?.checked)} />
                        </div>
                    </div>
                </div>
            </Content>
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
