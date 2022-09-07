import { useEffect, useState, Fragment } from "react";
import { Transition } from '@headlessui/react';
import { useTimeoutFn } from 'react-use';
import FolderCard from "../Folders/FolderItem/FolderCard";
import FolderCardAdd from "../Folders/FolderItem/FolderCardAdd";
import { selectArrayFolders } from "../../recoil/selectArrayFolders";
import { selectAllFolders } from "../../recoil/selectAllFolders";
import { useRecoilState } from "recoil";

interface Folder {
    id: number,
    name: string,
    createDate : string,
    todoItemArray : []
};

function FoldersBody() {
    const [folderListStorage, setFolderListStorage] = useState([]);

    const [arrayFolder, setArrayFolder] = useRecoilState(selectArrayFolders as any);

    const [selectAll, setSelectAll] = useRecoilState(selectAllFolders);

    let [isShowing, setIsShowing] = useState(false);
    let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

    const onSelectAllClick = () => {
        let selectAllButton = document.getElementById("idSelectAllFolders") as HTMLFormElement;
        if (selectAllButton.checked) {
            setSelectAll(true);
        }
        else {
            setSelectAll(false);
            setArrayFolder([]);
        }
    };

    useEffect(() => {
        setIsShowing(false)
        resetIsShowing()
    }, []);

    useEffect(() => {
        if (selectAll) {
            let newArrayFolders : any[] = [];
            folderListStorage.map((folder : Folder) => {
                newArrayFolders.push(String(folder.id));
            })
            setArrayFolder(newArrayFolders);
        }
        else {
            let selectAllButton = document.getElementById("idSelectAllFolders") as HTMLFormElement;
            selectAllButton.checked = false;
        }
    }, [selectAll]);

    useEffect(() => {
        // @ts-ignore
        const folderListStorage = JSON.parse(localStorage.getItem("folderList")) || [];
        if (folderListStorage.length == 0) {
            localStorage.setItem("folderList", JSON.stringify([{
                id: 0,
                name: "Default Folder",
                todoItemArray: [],
                createDate: new Date().toISOString().slice(0, 10)
            }]));
        }
    }, []);

    useEffect(() => {
        // @ts-ignore
        setFolderListStorage(JSON.parse(localStorage.getItem("folderList")) || []);
    }, [folderListStorage]);

    return (
        <>
            <div>
                <input id="idSelectAllFolders" type="checkbox" onClick={onSelectAllClick} className="ml-3 w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /> Select All
            </div>
            <div className="flex flex-wrap mt-5">
                {
                    folderListStorage.length > 0
                        ?
                        folderListStorage.map((folderItem : Folder, index) => {
                            return (
                                <div className="col-folder-list" key={"folderCardItem" + index}>
                                    <FolderCard {...folderItem} />
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