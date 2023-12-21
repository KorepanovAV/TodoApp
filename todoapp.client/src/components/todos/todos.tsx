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
        if (todos.length == 0) {
            populateTodos();
        }
    }, [todos]);

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
        const response = await fetch('api/todos', { method: 'POST', headers: { "Content-Type": "application/json", }, body });
        const data = await response.json() as ITodo;
        setTodos([...todos, data]);
    }

    async function handleTodoDelete(todo: ITodo) {
        await fetch(`api/todos/${todo.id}`, { method: 'DELETE' });
        setTodos([...todos.filter((v) => v.id != todo.id)]);
    }

    async function handleTodoPerform(todo: ITodo) {
        const data: ITodo = { ...todo, done: true };
        const body = JSON.stringify(data);
        await fetch(`api/todos/${todo.id}`, { method: 'PUT', headers: { "Content-Type": "application/json", }, body })
        setTodos([...todos.map(e => e.id == data.id ? data : e)]);
    }

    async function handleTodoToWork(todo: ITodo) {
        const data: ITodo = { ...todo, done: false };
        const body = JSON.stringify(data);
        await fetch(`api/todos/${todo.id}`, { method: 'PUT', headers: { "Content-Type": "application/json", }, body })
        setTodos([...todos.map(e => e.id == data.id ? data : e)]);
    }
}
