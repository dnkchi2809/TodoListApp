import { useState, useEffect, Fragment } from "react";
import { useRecoilState } from "recoil";
import { Transition } from '@headlessui/react';
import { useTimeoutFn } from 'react-use';
import { openImportModal } from "../../../recoil/openImportModal";
import Notes from "../../../../public/image/notes.png";
import { ImportTodoFile } from "../ImportTodoFile";
import {ImportFolderFile} from "../ImportFolderFile";

function ImportModal() {
    let [isShowing, setIsShowing] = useState(false);
    let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

    const [importModal, setImportModal] = useRecoilState(openImportModal);

    const onCancelClick = () => {
        setImportModal(false);
    }

    const onImportTodoClick = () => {
        ImportTodoFile();
    } 

    const onImportFolderClick = () => {
        ImportFolderFile();
    } 
    
    useEffect(() => {
        let modal = document.getElementById("idImportModal");
        if (importModal) {
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
            <div id="idImportModal" tabindex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full" onClick={onCancelClick}>
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
                                    <div className="flex items-center justify-center">
                                        <div className="w-1/2 p-5" onClick={onImportTodoClick} >
                                            <div id="image-note" className="image-import px-3 py-4 w-full h-40 flex justify-center items-center text-white"></div>
                                            <div className="text-center">Import Todo</div>
                                        </div>
                                        <div className="w-1/2" onClick={onImportFolderClick}>
                                            <div id="image-folder" className="image-import px-3 py-4 w-full h-40 flex justify-center items-center text-white"></div>
                                            <div className="text-center">Import Folders</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </>
    )
}

export default ImportModal;