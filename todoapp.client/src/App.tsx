import { useEffect, useState, MouseEventHandler } from 'react';
import { HashRouter, Route, Routes, NavLink } from 'react-router-dom';
import { useId } from 'react';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Right } from './components/Right/Right';
import { Content } from './components/Content/Content';

import './App.css';

interface IAddTodo {
    text?: string;
    important?: boolean;
}

interface IAddTodoProps {
    onAddTodo: (todo?: IAddTodo) => void;
}

function AddTodo(props: IAddTodoProps) {
    const { onAddTodo } = props;
    const checkboxLabelId = useId();
    const [form, setForm] = useState<IAddTodo>();
    const addClickHandler: MouseEventHandler = () => onAddTodo(form);

    return (
        <div className="AddTodo">
            <label className="TaskAdder_label TaskAdder_element" >Add new task</label>
            <input className="TaskAdder_element TaskAdder_text" type="text" placeholder="Text" onChange={(e) => setForm({ ...form, text: e.target.value })} />

            <input className="TaskAdder_element" type="checkbox" id={checkboxLabelId} onChange={(e) => setForm({ ...form, important: e.target.checked })} />
            <label className="TaskAdder_element" htmlFor={checkboxLabelId}>Important</label>

            <input className="TaskAdder_element" type="button" value="Add" onClick={addClickHandler} />
        </div>
    );
}

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

function App() {

    return (
        <HashRouter>
            <div className="root">
                <Routes>
                    <Route path="/" element={<Todos />} />
                    <Route path="/sort/importance" element={<Todos todoCompare={(l, r) => l.important != r.important ? (r.important ? 1 : -1) : (l.id - r.id)} />} />
                    <Route path="/sort/completed" element={<Todos todoCompare={(l, r) => l.done != r.done ? (r.done ? 1 : -1) : (l.id - r.id)} />} />
                </Routes>
            </div>
        </HashRouter>
    );
}

export default App;