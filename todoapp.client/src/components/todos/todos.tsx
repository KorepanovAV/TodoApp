import { useEffect, useState } from "react";
import { ITodo } from "../ITodo";
import { ITodoActions } from "../ITodoActions";
import { Header } from "../header/header";
import { AddTodo, IAddTodo } from "../add-todo/add-todo";
import { Main } from "../main/main";
import { Content } from "../content/content";
import { TodoList } from "../todo-list/todo-list";
import { Right } from "../right/right";
import { TodoSort } from "./todo-sort";

import './todos.css';

interface ITodosProps {
    todoCompare?: (l: ITodo, r: ITodo) => number;
}

export function Todos(props: ITodosProps) {
    const defaultTodoCompare: (l: ITodo, r: ITodo) => number = (l, r) => l.id - r.id;
    const todoCompare: (l: ITodo, r: ITodo) => number
        = props.todoCompare ?? defaultTodoCompare;

    const [todos, setTodos] = useState<ITodo[]>([]);
    const actions: ITodoActions = {
        onTodoDelete: handleTodoDelete,
        onTodoPerform: handleTodoPerform,
        onTodoToWork: handleTodoToWork
    };


    useEffect(() => {
        populateTodos();
    }, []);

    return (
        <>
            <Header><AddTodo onAddTodo={handleAddTodo} /></Header>
            <Main>
                <Content><TodoList todos={todos} todoActions={actions} todoCompare={todoCompare} /></Content>
                <Right><TodoSort /></Right>
            </Main>
        </>
    );

    async function populateTodos() {
        const response = await fetch('api/todos');
        const data = await response.json() as ITodo[];
        setTodos(data);
    }

    async function handleAddTodo(todo?: IAddTodo) {
        const body = JSON.stringify({ text: "empty", important: false, done: false, ...todo });
        await fetch('api/todos', { method: 'POST', headers: { "Content-Type": "application/json", }, body });
        await populateTodos();
    }

    async function handleTodoDelete(todo: ITodo) {
        await fetch(`api/todos/${todo.id}`, { method: 'DELETE' });
        await populateTodos();
    }

    async function handleTodoPerform(todo: ITodo) {
        const body = JSON.stringify({ ...todo, done: true });
        await fetch(`api/todos/${todo.id}`, { method: 'PUT', headers: { "Content-Type": "application/json", }, body })
        await populateTodos();
    }

    async function handleTodoToWork(todo: ITodo) {
        const body = JSON.stringify({ ...todo, done: false });
        await fetch(`api/todos/${todo.id}`, { method: 'PUT', headers: { "Content-Type": "application/json", }, body })
        await populateTodos();
    }
}
