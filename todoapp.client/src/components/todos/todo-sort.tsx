import { NavLink } from "react-router-dom";

export function TodoSort() {
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
