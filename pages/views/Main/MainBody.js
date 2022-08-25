import { useEffect, useState } from "react";
import TodoCard from "./TodoItem/TodoCard";
import TodoCardAdd from "./TodoItem/TodoCardAdd";
import TodoTime from "./TodoItem/TodoTime";

function MainBody() {

    const [todoListStorage, setTodoListStorage] = useState([])

    useEffect(() => {
        setTodoListStorage(JSON.parse(localStorage.getItem("todoList")) || [])
    }, todoListStorage)
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
                <div class="w-1/4 p-5">
                    <TodoCardAdd />
                </div>

            </div>
        </>
    )
}

export default MainBody;