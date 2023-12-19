import { useEffect, useState, MouseEventHandler } from 'react';
import { HashRouter, Route, Routes, NavLink, useParams } from 'react-router-dom';
import { useId } from 'react';
import { Header } from './components/header/header';
import { Main } from './components/Main/Main';
import { Right } from './components/Right/Right';
import { Content } from './components/content/Content';
import { AddTodo, IAddTodo } from './components/add-todo/add-todo';

import block from 'bem-cn-lite';

import './App.css';


interface ITodo {
    id: number;
    text: string;
    important: boolean;
    done: boolean;
}

interface ITodoActions {
    onTodoDelete: (todo: ITodo) => void;
    onTodoPerform: (todo: ITodo) => void;
    onTodoToWork: (todo: ITodo) => void;
}

interface ITodoItemProps {
    todo: ITodo;
    todoActions: ITodoActions;
}

function TodoItem(props: ITodoItemProps) {
    const { todo, todoActions: { onTodoDelete, onTodoPerform, onTodoToWork } } = props;

    const importanceMark = todo.important
        ? <span className="important">!</span>
        : <span className="important">&nbsp;</span>;

    const actionButton = todo.done
        ? <input type="button" value="To work" onClick={() => onTodoToWork(todo)} />
        : <input type="button" value="Perform" onClick={() => onTodoPerform(todo)} />;

    return (
        <>
            <div className="TodoItem">
                {importanceMark}&nbsp;
                <a href={`#/todo/${todo.id}`}>{todo.text}</a>&nbsp;
                {actionButton}&nbsp;
                <input type="button" value="Delete" onClick={() => onTodoDelete(todo)} />
            </div>
        </>
    );
}

interface ITodoListProps {
    todos: ITodo[];
    todoActions: ITodoActions;
    todoCompare: (l: ITodo, r: ITodo) => number;
}

function TodoList(props: ITodoListProps) {
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

function TodoSort() {
    return (
        <>
            <span>Сортировать</span>
            <nav>
                <div><NavLink to="/sort/importance">По важности</NavLink></div>
                <div><NavLink to="/sort/completed">По выполненности</NavLink></div>
            </nav>
        </>    
    );
}

interface ITodosProps {
    todoCompare?: (l: ITodo, r: ITodo) => number;
}

function Todos(props: ITodosProps) {
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
                <Right><TodoSort/></Right>
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

function TodoCard() {
    const params = useParams<{ id: string}>();
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

function App() {

    return (
        <HashRouter>
            <div className="root">
                <Routes>
                    <Route path="/" element={<Todos />} />
                    <Route path="/sort/importance" element={<Todos todoCompare={(l, r) => l.important != r.important ? (r.important ? 1 : -1) : (l.id - r.id)} />} />
                    <Route path="/sort/completed" element={<Todos todoCompare={(l, r) => l.done != r.done ? (r.done ? 1 : -1) : (l.id - r.id)} />} />
                    <Route path="/todo/:id" element={<TodoCard />} />
                </Routes>
            </div>
        </HashRouter>
    );
}

export default App;