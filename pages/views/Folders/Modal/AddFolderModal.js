import { useState, useEffect, Fragment } from "react";
import { useRecoilState } from "recoil";
import { Transition } from '@headlessui/react';
import { useTimeoutFn } from 'react-use';
import { openAddFolderModal } from "../../../recoil/opennAddFolderModal";

function AddFolderModal() {

    let [isShowing, setIsShowing] = useState(false);
    let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

    const [newFolderItem, setNewFolderItem] = useState({
        id: 0,
        name: "",
        createDate: "",
        todoItemArray: Array()
    });

    const [openModalAddFolder, setOpenModalAddFolder] = useRecoilState(openAddFolderModal);

    const onChangeFolderName = (event) => {
        newFolderItem.name = event.target.value;
    }

    const clearData = () => {
    }

    const onCancelClick = () => {
        clearData();
        setOpenModalAddFolder(false);
    }

    const onCreateFolderClick = () => {
        const validFolder = validateFolder(newFolderItem);

        var arrayTempFolder = [];
        var folderListStorage = JSON.parse(localStorage.getItem("folderList")) || [];
        arrayTempFolder = folderListStorage;

        if (validFolder) {
            if (folderListStorage.length <= 0) {
                newFolderItem.id = 0;
            }
            else {
                newFolderItem.id = folderListStorage[(folderListStorage.length - 1)].id + 1;
            }
            newFolderItem.createDate = new Date().toISOString().slice(0, 10);

            arrayTempFolder.push(newFolderItem);

            localStorage.setItem("folderList", JSON.stringify(arrayTempFolder));
            onCancelClick();
        }
    }

    const validateFolder = (paramFolder) => {
        if (paramFolder.label == "") {
            alert("Folder Name is invalid");
            return false;
        }
        return true;
    }

    useEffect(() => {
        let modal = document.getElementById("addFolderModal");
        if (openModalAddFolder) {
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
            <div id="addFolderModal" tabindex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full">
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
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <input id="idLabelFolder" placeholder="Folder Label" className="w-full mb-3 text-lg font-medium" onChange={onChangeFolderName} />
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button data-modal-toggle="addFolderModal" type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={onCreateFolderClick}>Create Folder</button>
                                    <button data-modal-toggle="addFolderModal" type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={onCancelClick}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </>
    )
}
export default AddFolderModal;