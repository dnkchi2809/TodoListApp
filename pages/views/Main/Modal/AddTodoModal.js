import { useState, useEffect, Fragment } from "react";
import { useRecoilState } from "recoil";
import { openAddTodoModal } from "../../../recoil/openAddTodoModal";
import { Transition } from '@headlessui/react';
import { useTimeoutFn } from 'react-use';
import FolderSelect from "../../Folders/FolderItem/FolderSelect";
import { selectFolder } from "../../../recoil/selectFolder";

function AddTodoModal() {

    let [isShowing, setIsShowing] = useState(false);
    let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

    const [selectedFolder, setSelectedFolder] = useRecoilState(selectFolder);

    const [newTodoItem, setNewTodoItem] = useState({
        id: 0,
        label: "",
        detail: "",
        createDate: "",
        folderId: 0,
        history: Array({
            historyId: 0,
            updateDate: ""
        })
    });

    const [openModalAddTodo, setOpenModalAddTodo] = useRecoilState(openAddTodoModal);

    const clearData = () => {
        document.getElementById("idLabel").value = "";
        document.getElementById("idDetail").value = "";
    }

    const onCancelClick = () => {
        clearData();
        setOpenModalAddTodo(false);
    }

    const onInputLabelTodo = (event) => {
        newTodoItem.label = event.target.value;
        newTodoItem.createDate = new Date().toISOString().slice(0, 10);
    }

    const onInputDetailTodo = (event) => {
        newTodoItem.detail = event.target.value;
    }

    const onSaveNewTodo = () => {
        const validTodo = validateNewTodoItem(newTodoItem);

        var arrayTempTodo = [];
        var todoListStorage = JSON.parse(localStorage.getItem("todoList")) || [];
        arrayTempTodo = todoListStorage;

        var folderListStorage = JSON.parse(localStorage.getItem("folderList")) || [];

        if (validTodo) {
            if (todoListStorage.length <= 0) {
                newTodoItem.id = 0;
            }
            else {
                newTodoItem.id = todoListStorage[(todoListStorage.length - 1)].id + 1;
            }

            arrayTempTodo.push(newTodoItem);

            localStorage.setItem("todoList", JSON.stringify(arrayTempTodo));

            folderListStorage.map((folder) => {
                if (folder.id == newTodoItem.folderId){
                    folder.todoItemArray.push(newTodoItem.id);                                                                                                                                            
                }                  
            });

            localStorage.setItem("folderList", JSON.stringify(folderListStorage));

            onCancelClick();
        }
    }

    const validateNewTodoItem = (paramItem) => {
        if (paramItem.label == "") {
            alert("Label is invalid");
            return false
        }
        return true;
    }

    useEffect(() => {
        newTodoItem.folderId = selectedFolder.id;

        let modal = document.getElementById("addModal");
        if (openModalAddTodo) {
            modal.classList.remove("hidden");
            setIsShowing(true);
            resetIsShowing();
        }
        else {
            setIsShowing(false);
            resetIsShowing();
            modal.classList.add("hidden");
        }
    })
    return (
        <>
            {/*Modal*/}
            <div id="addModal" tabindex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full">
                <div className="fixed inset-0 bg-gray-200 bg-opacity-70 transition-opacity"></div>

                <Transition
                    as={Fragment}
                    show={isShowing}
                    enter="transform transition duration-[4000ms] linear"
                    enterFrom="opacity-0 scale-50"
                    enterTo="opacity-100 scale-100"
                    leave="transform duration-200 transition ease-in-out"
                    leaveFrom="opacity-100 scale-100 "
                    leaveTo="opacity-0 scale-50 "
                >
                    <div className="fixed z-10 inset-0 overflow-y-auto shadow-md">
                        <div className="flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <input id="idLabel" placeholder="To Do Label" className="w-full mb-3 text-lg font-medium" onInput={onInputLabelTodo}></input>
                                    </div>
                                    <FolderSelect />
                                    <div className="sm:flex sm:items-start">
                                        <form className="w-full">
                                            <div className="w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                                                <div className="flex justify-between items-center py-2 px-3 border-b dark:border-gray-600">
                                                    <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
                                                        <div className="flex items-center space-x-1 sm:pr-4">
                                                            <button type="button" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path></svg>
                                                                <span className="sr-only">Attach file</span>
                                                            </button>
                                                            <button type="button" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                                                <span className="sr-only">Embed map</span>
                                                            </button>
                                                            <button type="button" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
                                                                <span className="sr-only">Upload image</span>
                                                            </button>
                                                            <button type="button" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                                                <span className="sr-only">Format code</span>
                                                            </button>
                                                            <button type="button" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd"></path></svg>
                                                                <span className="sr-only">Add emoji</span>
                                                            </button>
                                                        </div>
                                                        <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
                                                            <button type="button" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                                                                <span className="sr-only">Add list</span>
                                                            </button>
                                                            <button type="button" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
                                                                <span className="sr-only">Settings</span>
                                                            </button>
                                                            <button type="button" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                                                                <span className="sr-only">Timeline</span>
                                                            </button>
                                                            <button type="button" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                                                <span className="sr-only">Download</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <button type="button" data-tooltip-target="tooltip-fullscreen" className="p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                                        <span className="sr-only">Full screen</span>
                                                    </button>
                                                    <div id="tooltip-fullscreen" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700" data-popper-reference-hidden="" data-popper-placement="top">
                                                        Show full screen
                                                        <div className="tooltip-arrow" data-popper-arrow=""></div>
                                                    </div>
                                                </div>
                                                <div className="py-2 px-4 bg-white rounded-b-lg dark:bg-gray-800">
                                                    <label for="idDetail" className="sr-only">Publish post</label>
                                                    <textarea id="idDetail" rows="8" className="block px-0 w-full text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write an article..." required="" onInput={onInputDetailTodo}></textarea>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button data-modal-toggle="addModal" type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={onSaveNewTodo}>Save</button>
                                    <button data-modal-toggle="addModal" type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={onCancelClick}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </>
    )
}

export default AddTodoModal;
