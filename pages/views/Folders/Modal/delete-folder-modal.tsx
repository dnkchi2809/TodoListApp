import { useState, useEffect, Fragment, useRef } from "react";
import { useRecoilState } from "recoil";
import { openDeleteFolderModal } from "../../../../Recoil/open-delete-folder-modal";
import { Transition } from '@headlessui/react';
import { useTimeoutFn } from 'react-use';

interface Folder {
    id: number,
    name: string,
    createDate: string,
    todoItemArray: []
};

interface Todo {
    id: number,
    label: string,
    detail: string,
    createDate: string,
    state: string,
    folderId: number,
    history: {
        historyId: number,
        updateDate: string
    }[]
};

function DeleteFolderModal(props: Todo) {

    let [isShowing, setIsShowing] = useState(false);
    let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

    let folderId = props.folderId;

    const [folderSelect, setFolderSelect] = useState([]);

    const [todoItemList, setTodoItemList] = useState([]);

    const [deleteFolderModal, setDeleteFolderModal] = useRecoilState(openDeleteFolderModal);

    const delFolderModal = useRef<HTMLDivElement>(null);

    const onCancelClick = () => {
        setDeleteFolderModal(false);
    };

    const onConfirmDeleteClick = () => {
        if (todoItemList.length > 0) {
            alert("Cannot delete Folder having Todo!");
            onCancelClick();
        }
        else {
            let arrayTempFolder: [];
            // @ts-ignore
            let folderListStorage = JSON.parse(localStorage.getItem("folderList")) || [];
            arrayTempFolder = folderListStorage;

            folderListStorage.map((folder: Folder, index: number) => {
                if (folder.id == folderId) {
                    arrayTempFolder.splice(index, 1);
                }
            });

            localStorage.setItem("folderList", JSON.stringify(arrayTempFolder));

            alert("Delete folder success!");

            onCancelClick();
            window.location.href = "/folders"
        }

    }

    useEffect(() => {
        // @ts-ignore
        const folderListStorage = JSON.parse(localStorage.getItem("folderList")) || [];

        setFolderSelect(folderListStorage.filter((folder: Folder) => {
            return folder.id == folderId;
        }));
    }, [folderId]);

    useEffect(() => {
        if (folderId >= 0) {
            // @ts-ignore
            const todoListStorage = JSON.parse(localStorage.getItem("todoList")) || [];

            setTodoItemList(todoListStorage.filter((todo : Todo) => {
                return todo.folderId == folderId;
            }));
        }
    }, [folderId])

    useEffect(() => {
        if (deleteFolderModal) {
            delFolderModal.current?.classList.remove("hidden");
            setIsShowing(true);
            resetIsShowing();
        }
        else {
            setIsShowing(false);
            resetIsShowing();
            delFolderModal.current?.classList.add("hidden");
        }
    }, [deleteFolderModal, resetIsShowing])
    return (
        <>
            {/*Modal*/}
            <div ref={delFolderModal} tabIndex={-1} className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full flex justify-center items-center inset-0 bg-gray-200 bg-opacity-60 transition-opacity">
                <div className="relative p-4 w-full max-w-md h-full md:h-auto">
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
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal" onClick={onCancelClick}>
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-6 text-center">
                                <svg aria-hidden="true" className="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
                                <button data-modal-toggle="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2" onClick={onConfirmDeleteClick}>
                                    Yes, Im sure
                                </button>
                                <button data-modal-toggle="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={onCancelClick}>No, cancel</button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </>
    )
}

export default DeleteFolderModal;
