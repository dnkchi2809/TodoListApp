import { useEffect, useState, Fragment } from "react";
import { Transition } from '@headlessui/react';
import { useTimeoutFn } from 'react-use';
import TodoCardAdd from "../../Main/TodoItem/TodoCardAdd";
import TodoCard from "../../Main/TodoItem/TodoCard";
import styles from '../../../../styles/Home.module.css'
import { useRecoilState } from "recoil";
import { openDeleteFolderModal } from "../../../recoil/openDeleteFolderModal";
import DeleteFolderModal from "../Modal/DeleteFolderModal";

function FolderDetail(props) {

    let [isShowing, setIsShowing] = useState(false);
    let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

    let folderId = props.folderId;

    const [folderSelect, setFolderSelect] = useState([]);

    const [todoItemList, setTodoItemList] = useState([]);

    const [deleteFolderModal, setDeleteFolderModal] = useRecoilState(openDeleteFolderModal);

    const onChangeFolderName = (event) => {
        if (event.target.value !== "") {
            let arrayTempFolder = [];
            let folderListStorage = JSON.parse(localStorage.getItem("folderList")) || [];
            arrayTempFolder = folderListStorage;
            arrayTempFolder.map((folder) => {
                if (folder.id == folderId) {
                    folder.name = event.target.value;
                }
            })

            localStorage.setItem("folderList", JSON.stringify(arrayTempFolder));
        }
    }

    const onBackClick = () => {
        window.location.href = "/folders"
    }

    const onDeleteFolderClick = () => {
        setDeleteFolderModal(true);
    }

    useEffect(() => {
        setIsShowing(false)
        resetIsShowing()
    }, []);

    useEffect(() => {
        const folderListStorage = JSON.parse(localStorage.getItem("folderList")) || [];

        setFolderSelect(folderListStorage.filter((folder) => {
            return folder.id == folderId;
        }));
    }, [folderId]);

    useEffect(() => {
        if (folderId >= 0) {
            const todoListStorage = JSON.parse(localStorage.getItem("todoList")) || [];

            setTodoItemList(todoListStorage.filter((todo) => {
                return todo.folderId == folderId;
            }));
        }
    });

    return (
        <>
            <div className="flex padding-class">
                <div className="w-3/4">
                    <input onChange={onChangeFolderName} defaultValue={folderSelect.length > 0 ? folderSelect[0].name : null} className="w-full mb-3 text-lg font-medium"></input>
                </div>
                <div className="w-1/4">
                    <p className="mb-3 font-thin text-blue-500 text-right">Create Date: {folderSelect.length > 0 ? folderSelect[0].createDate : null}</p>
                </div>
            </div>
            <div className="flex flex-wrap">
                {
                    todoItemList.length > 0
                        ?
                        todoItemList.map((todoItem, index) => {
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
            <div className="flex w-full justify-end padding-class">
                <div className="fixed bottom-0 flex py-3">
                    <button className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={onBackClick}>Back</button>
                    <button className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={onDeleteFolderClick}>Delete Folder</button>
                </div>
            </div>

            <DeleteFolderModal folderId={folderId} />
        </>
    )
}

export default FolderDetail;