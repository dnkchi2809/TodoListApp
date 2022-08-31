import { useEffect, useState, Fragment } from "react";
import { useRecoilState } from "recoil";
import { selectAllItems } from "../../recoil/selectAllItems";
import { selectArrayItems } from "../../recoil/selectManyItems";
import TodoCard from "./TodoItem/TodoCard";
import TodoCardAdd from "./TodoItem/TodoCardAdd";
import TodoState from "./TodoItem/TodoState";
import { Transition } from '@headlessui/react';
import { useTimeoutFn } from 'react-use';
import { selectState } from "../../recoil/selectState";

function MainBody() {
    const [todoListStorage, setTodoListStorage] = useState([]);
    const [selectAll, setSelectAll] = useRecoilState(selectAllItems);
    const [arrayItems, setArrayItems] = useRecoilState(selectArrayItems);

    const [selectedState, setSelectedState] = useRecoilState(selectState);

    let [isShowing, setIsShowing] = useState(false);
    let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

    const onSelectAllClick = () => {
        let selectAllButton = document.getElementById("idSelectAll");
        if (selectAllButton.checked) {
            setSelectAll(true);
        }
        else {
            setSelectAll(false);
            setArrayItems([]);
        }
    };

    useEffect(() => {
        setIsShowing(false);
        resetIsShowing();
    }, []);

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
    }, [selectAll]);

    useEffect(() => {
        const folderListStorage = JSON.parse(localStorage.getItem("folderList")) || [];
        if (folderListStorage.length == 0) {
            localStorage.setItem("folderList", JSON.stringify([{
                id: 0,
                name: "Default Folder",
                todoItemArray: [],
                createDate : new Date().toISOString().slice(0, 10)
            }]));
        }
    }, []);

    useEffect(() => {
        if(selectedState.name == "All"){
            setTodoListStorage(JSON.parse(localStorage.getItem("todoList")) || []);
        }
        else{
            let todoListStorage = JSON.parse(localStorage.getItem("todoList")) || [];
            let filterTodoState = todoListStorage.filter((todo) => {
                return todo.state == selectedState.name
            })
            setTodoListStorage(filterTodoState);
        }
        
    }, [todoListStorage, selectAll, arrayItems]);
    return (
        <>
            <div>
                <TodoState/>
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
                                    <TodoCard item={todoItem} />
                                </div>
                            )
                        })
                        :
                        null
                }
                <Transition
                    as={Fragment}
                    // appear={true}
                    show={isShowing}
                    enter="transform transition duration-[1000ms] linear"
                    enterFrom="opacity-0 scale-50"
                    enterTo="opacity-100 scale-100"
                    leave="transform duration-200 transition ease-in-out"
                    leaveFrom="opacity-100 scale-100 "
                    leaveTo="opacity-0 scale-50 "
                >
                    <div className="col-todo-list">
                        <TodoCardAdd />
                    </div>
                </Transition>
            </div>
        </>
    )
}

export default MainBody;