import { useEffect, useState, Fragment } from "react";
import { Transition } from '@headlessui/react';
import { useTimeoutFn } from 'react-use';
import FolderCard from "../Folders/FolderItem/FolderCard";
import FolderCardAdd from "../Folders/FolderItem/FolderCardAdd";

function FoldersBody() {
    const [folderListStorage, setFolderListStorage] = useState([]);

    let [isShowing, setIsShowing] = useState(false);
    let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

    useEffect(() => {
        setIsShowing(false)
        resetIsShowing()
    }, []);

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
        setFolderListStorage(JSON.parse(localStorage.getItem("folderList")) || []);
    }, [folderListStorage]);

    return (
        <>
            <div className="flex flex-wrap mt-5">
                {
                    folderListStorage.length > 0
                        ?
                        folderListStorage.map((folderItem, index) => {
                            return (
                                <div className="col-folder-list" key={"folderCardItem" + index}>
                                    <FolderCard item={folderItem} />
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
                    <div className="col-folder-list">
                        <FolderCardAdd />
                    </div>
                </Transition>
            </div>

        </>
    )
}

export default FoldersBody;