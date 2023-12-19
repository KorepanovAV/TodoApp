import { HashRouter, Route, Routes } from 'react-router-dom';
import { Todos } from './components/todos/todos';
import { TodoCard } from './components/todo-card/todo-card';

import block from 'bem-cn-lite';

import './App.css';

const b = block('app');

function App() {

    return (
        <HashRouter>
            <div className={b()}>
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