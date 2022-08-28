import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { selectAllItems } from "../../recoil/selectAllItems";
import { selectArrayItems } from "../../recoil/selectManyItems";
import TodoCard from "./TodoItem/TodoCard";
import TodoCardAdd from "./TodoItem/TodoCardAdd";
import TodoTime from "./TodoItem/TodoTime";

function MainBody() {
    const [todoListStorage, setTodoListStorage] = useState([]);
    const [selectAll, setSelectAll] = useRecoilState(selectAllItems);
    const [arrayItems, setArrayItems] = useRecoilState(selectArrayItems);

    const onSelectAllClick = () => {
        let selectAllButton = document.getElementById("idSelectAll");
        if (selectAllButton.checked) {
            setSelectAll(true);
        }
        else {
            setSelectAll(false);
            setArrayItems([]);
        }
    }

    useEffect(() => {
        if (selectAll) {
            let newArrayItems = [];
            todoListStorage.map((todoItem) => {
                newArrayItems.push(String(todoItem.id));
            })
            setArrayItems(newArrayItems);
        }
        else {
            document.getElementById("idSelectAll").checked = false;
        }
    }, [selectAll])

    useEffect(() => {
        setTodoListStorage(JSON.parse(localStorage.getItem("todoList")) || []);
    }, [todoListStorage, selectAll, arrayItems])
    return (
        <>
            <div>
                <TodoTime />
            </div>
            <div>
                <input id="idSelectAll" type="checkbox" onClick={onSelectAllClick} className="ml-5 w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /> Select All
            </div>
            <div className="flex flex-wrap">
                {
                    todoListStorage.length > 0
                        ?
                        todoListStorage.map((todoItem, index) => {
                            return (
                                <div className="col-todo-list" key={"todoCardItem" + index}>
                                    <TodoCard item={todoItem}/>
                                </div>
                            )
                        })
                        :
                        null
                }
                <div className="col-todo-list">
                    <TodoCardAdd />
                </div>
            </div>
        </>
    )
}

export default MainBody;