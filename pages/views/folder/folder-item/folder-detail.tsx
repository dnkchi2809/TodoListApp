import { useEffect, useState, Fragment, useRef } from "react";
import { Transition } from "@headlessui/react";
import { useTimeoutFn } from "react-use";
import TodoCardAdd from "../../main/todo-item/todo-card-add";
import TodoCard from "../../main/todo-item/todo-card";
import { useRecoilState, useSetRecoilState } from "recoil";
import { openDeleteFolderModal } from "../../../../recoil/open-delete-folder-modal";
import DeleteFolderModal from "../modal/delete-folder-modal";
import { selectAllItems } from "../../../../recoil/select-all-items";
import { selectArrayItems } from "../../../../recoil/select-many-items";
import { selectState } from "../../../../recoil/select-state";
import TodoState from "../../main/todo-item/todo-state";
import { useRouter } from "next/router";
import { folderLocalStorageChange } from "../../../../recoil/folder-localstorage-change";
import { useTranslation } from "react-i18next";
import { todoLocalStorageChange } from "../../../../recoil/todo-localstorage-change";

interface Todo {
  id: number;
  label: string;
  detail: string;
  createDate: string;
  state: string;
  folderId: number;
  history: {
    historyId: number;
    updateDate: string;
  }[];
}

interface Folder {
  id: number;
  name: string;
  createDate: string;
  todoItemArray: [];
}

function FolderDetail(props: Todo) {
  const { t } = useTranslation();

  const router = useRouter();

  const [isShowing, setIsShowing] = useState(false);
  const [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

  const [todoStorageChange, setTodoStorageChange] = useRecoilState(
    todoLocalStorageChange
  );

  const [folderStorageChange, setFolderStorageChange] = useRecoilState(
    folderLocalStorageChange
  );

  const folderId = Number(props.folderId);

  const [folderSelect, setFolderSelect] = useState([
    {
      id: 0,
      name: "",
      createDate: "",
      todoItemArray: [],
    },
  ]);

  const [todoItemList, setTodoItemList] = useState([]);

  const [selectAll, setSelectAll] = useRecoilState(selectAllItems);
  const setArrayItems = useSetRecoilState(selectArrayItems);

  const [selectedState] = useRecoilState(selectState);

  const setDeleteFolderModal = useSetRecoilState(openDeleteFolderModal);

  const [inputSelectAll, setInputSelectAll] = useState(false);

  const idSelectAllTodoOfFolder = useRef<HTMLInputElement>(null);

  const onChangeFolderName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== "") {
      let arrayTempFolder = [];
      const folderListStorage = JSON.parse(
        localStorage.getItem("folderList") || "[]"
      );
      arrayTempFolder = folderListStorage;
      arrayTempFolder.map((folder: Folder) => {
        if (folder.id == folderId) {
          folder.name = event.target.value;
        }
      });

      localStorage.setItem("folderList", JSON.stringify(arrayTempFolder));
      setFolderStorageChange(true);
    }
  };

  const onBackClick = () => {
    router.push("/folders");
  };

  const onDeleteFolderClick = () => {
    setDeleteFolderModal(true);
  };

  const onSelectAllClick = () => {
    setInputSelectAll(!inputSelectAll);
    if (idSelectAllTodoOfFolder.current?.checked) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
      setArrayItems([]);
    }
  };

  useEffect(() => {
    setIsShowing(false);
    resetIsShowing();
  }, [resetIsShowing]);

  useEffect(() => {
    if (selectAll) {
      const newArrayItems: number[] = [];
      todoItemList.map((todoItem: Todo) => {
        newArrayItems.push(Number(todoItem.id));
      });
      setArrayItems(newArrayItems);
    } else {
      setInputSelectAll(false);
    }
  }, [selectAll, setArrayItems, todoItemList]);

  useEffect(() => {
    const folderListStorage = JSON.parse(
      localStorage.getItem("folderList") || "[]"
    );

    setFolderSelect(
      folderListStorage.filter((folder: Folder) => {
        return folder.id == folderId;
      })
    );
  }, [folderId, folderStorageChange]);

  const [storage, setStorage] = useState([]);

  useEffect(() => {
    setStorage(JSON.parse(localStorage.getItem("todoList") || "[]"));
  }, []);

  useEffect(() => {
    if (todoStorageChange) {
      setStorage(JSON.parse(localStorage.getItem("todoList") || "[]"));
      setTodoStorageChange(false);
    }
  }, [setTodoStorageChange, todoStorageChange]);

  useEffect(() => {
    if (folderStorageChange) {
      setStorage(JSON.parse(localStorage.getItem("folderList") || "[]"));
      setFolderStorageChange(false);
    }
  }, [setFolderStorageChange, folderStorageChange]);

  useEffect(() => {
    if (folderId >= 0) {
      if (selectedState.name == "All") {
        setTodoItemList(
          storage.filter((todo: Todo) => {
            return todo.folderId == folderId;
          })
        );
      } else {
        const filterTodoState = storage.filter((todo: Todo) => {
          return todo.folderId == folderId && todo.state == selectedState.name;
        });
        setTodoItemList(filterTodoState);
      }
    }
  }, [folderId, selectedState.name, storage]);

  return (
    <>
      <div className="">
        <div className="flex padding-class">
          <div className="w-3/4">
            <input
              onChange={onChangeFolderName}
              defaultValue={folderSelect.length > 0 ? folderSelect[0].name : ""}
              className="w-full mb-3 text-lg font-medium"
            />
          </div>
          <div className="w-1/4">
            <p className="mb-3 font-thin text-blue-500 text-right">
              {t("content.Create Date")}:{" "}
              {folderSelect.length > 0 ? folderSelect[0].createDate : null}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/2">
            <input
              ref={idSelectAllTodoOfFolder}
              checked={inputSelectAll}
              type="checkbox"
              onChange={onSelectAllClick}
              className="ml-5 w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />{" "}
            {t("content.Select All")}
          </div>
          <div className="w-1/2">
            <TodoState />
          </div>
        </div>
        <div className="flex flex-wrap">
          {todoItemList.length > 0
            ? todoItemList.map((todoItem: Todo, index) => {
                return (
                  <div className="col-todo-list" key={"todoCardItem" + index}>
                    <TodoCard {...todoItem} />
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
            <div className="col-todo-list">
              <TodoCardAdd />
            </div>
          </Transition>
        </div>
        <div className="flex w-full justify-end padding-class">
          <div className="bottom-0 flex py-3">
            <button
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onBackClick}
            >
              {t("content.Back")}
            </button>
            <button
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onDeleteFolderClick}
            >
              {t("content.Delete Folder")}
            </button>
          </div>
        </div>
      </div>

      <DeleteFolderModal
        folderId={folderId}
        id={0}
        label={""}
        detail={""}
        createDate={""}
        state={""}
        history={[]}
      />
    </>
  );
}

export default FolderDetail;
