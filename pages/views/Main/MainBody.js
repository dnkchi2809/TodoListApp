import { useEffect, useState } from "react";
import TodoCard from "./TodoItem/TodoCard";
import TodoCardAdd from "./TodoItem/TodoCardAdd";
import TodoTime from "./TodoItem/TodoTime";

function MainBody() {

    const [todoListStorage, setTodoListStorage] = useState([]);
    const [state, setState ] = useState(todoListStorage.length);

    useEffect(() => {
        setTodoListStorage(JSON.parse(localStorage.getItem("todoList")) || [])
        setState(todoListStorage.length)
    }, state)
    return (
        <>
            <div>
                <TodoTime />
            </div>
            <div className="flex flex-wrap">
                {
                    todoListStorage.length > 0
                        ?
                        todoListStorage.map((todoItem, index) => {
                            return (
                                <div className="col-todo-list">
                                    <TodoCard />
                                </div>
                            )
                        })
                        :
                        null
                }
                <div class="col-todo-list">
                    <TodoCardAdd />
                </div>

            </div>
        </>
    )
}

export default MainBody;