import { useEffect, useState, Fragment, useRef } from "react";
import { Transition } from "@headlessui/react";
import { useTimeoutFn } from "react-use";
import FolderCard from "../folder/folder-item/folder-card";
import FolderCardAdd from "../folder/folder-item/folder-card-add";
import { selectArrayFolders } from "../../../recoil/select-array-folders";
import { selectAllFolders } from "../../../recoil/select-all-folders";
import { useRecoilState, useSetRecoilState } from "recoil";
import { pageNavigate } from "../../../recoil/page-navigate";
import { folderLocalStorageChange } from "../../../recoil/folder-localstorage-change";

interface Folder {
  id: number;
  name: string;
  createDate: string;
  todoItemArray: [];
}

function FoldersBody() {
  const [folderStorageChange, setFolderStorageChange] = useRecoilState(
    folderLocalStorageChange
  );

  const [folderListStorage, setFolderListStorage] = useState([]);

  const setArrayFolder = useSetRecoilState(selectArrayFolders);

  const [selectAll, setSelectAll] = useRecoilState(selectAllFolders);

  const [isShowing, setIsShowing] = useState(false);
  const [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

  const setSelectedPage = useSetRecoilState(pageNavigate);

  const [inputSelectAll, setInputSelectAll] = useState(false);

  const idSelectAllFolders = useRef<HTMLInputElement>(null);

  const onSelectAllClick = () => {
    setInputSelectAll(!inputSelectAll);
    if (idSelectAllFolders.current?.checked) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
      setArrayFolder([]);
    }
  };

  useEffect(() => {
    setSelectedPage("folder");
  }, [setSelectedPage]);

  useEffect(() => {
    setIsShowing(false);
    resetIsShowing();
  }, [resetIsShowing]);

  useEffect(() => {
    if (selectAll) {
      const newArrayFolders: number[] = [];
      folderListStorage.map((folder: Folder) => {
        newArrayFolders.push(Number(folder.id));
      });
      setArrayFolder(newArrayFolders);
    }
  }, [folderListStorage, selectAll, setArrayFolder]);

  useEffect(() => {
    if (!selectAll) {
      setInputSelectAll(false);
    }
  }, [selectAll]);

  useEffect(() => {
    const folderListStorage = JSON.parse(
      localStorage.getItem("folderList") || "[]"
    );
    if (folderListStorage.length == 0) {
      localStorage.setItem(
        "folderList",
        JSON.stringify([
          {
            id: 0,
            name: "Default Folder",
            todoItemArray: [],
            createDate: new Date().toISOString().slice(0, 10),
          },
        ])
      );
    }
  }, []);

  useEffect(() => {
    setFolderListStorage(
      JSON.parse(localStorage.getItem("folderList") || "[]")
    );
  }, []);

  useEffect(() => {
    if (folderStorageChange) {
      setFolderListStorage(
        JSON.parse(localStorage.getItem("folderList") || "[]")
      );
      setFolderStorageChange(false);
    }
  }, [setFolderStorageChange, folderStorageChange]);

  return (
    <>
      <div>
        <input
          ref={idSelectAllFolders}
          checked={inputSelectAll}
          type="checkbox"
          onChange={onSelectAllClick}
          className="ml-3 w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />{" "}
        Select All
      </div>
      <div className="flex flex-wrap mt-5">
        {folderListStorage.length > 0
          ? folderListStorage.map((folderItem: Folder, index) => {
              return (
                <div className="col-folder-list" key={"folderCardItem" + index}>
                  <FolderCard {...folderItem} />
                </div>
              );
            })
          : null}
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
  );
}

export default FoldersBody;
