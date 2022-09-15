import { useEffect, useState } from "react";
import { selectFolder } from "../../../recoil/select-folder";
import FolderSelect from "../folder/folder-item/folder-select";
import { useRecoilState, useSetRecoilState } from "recoil";
import { selectStateOfItem } from "../../../recoil/select-state-of-item";
import TodoStateOfItem from "./todo-item/todo-state-of-item";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { todoLocalStorageChange } from "../../../recoil/todo-localstorage-change";

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
  todoItemArray: number[];
}

interface ItemProps {
  itemId: number;
}

function TodoDetail(props: ItemProps) {
  const { t } = useTranslation();

  const router = useRouter();

  const itemId = props.itemId;

  const [todoItem, setTodoItem] = useState({
    id: 0,
    label: "",
    detail: "",
    createDate: "",
    state: "",
    folderId: 0,
    history: [
      {
        historyId: 0,
        updateDate: "",
      },
    ],
  });

  const [selectedFolder, setSelectedFolder] = useRecoilState(selectFolder);

  const setTodoStorageChange = useSetRecoilState(todoLocalStorageChange);

  const [selectedState, setSelectedState] = useRecoilState(selectStateOfItem);

  const [updateTodoItem, setUpdateTodoItem] = useState({
    id: 0,
    label: "",
    detail: "",
    state: selectedState.name,
    createDate: "",
    folderId: selectedFolder.id,
    history: [
      {
        historyId: 0,
        updateDate: "",
      },
    ],
  });

  const [updateHistory, setUpdateHistory] = useState({
    historyId: 0,
    updateDate: "",
    updateLabel: "",
    updateDetail: "",
  });

  const onChangeLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateHistory.updateLabel = event.target.value;
    updateTodoItem.label = event.target.value;
  };

  const onChangeTodoDetail = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateHistory.updateDetail = event.target.value;
    updateTodoItem.detail = event.target.value;
  };

  const clearData = () => {
    setUpdateTodoItem({
      id: 0,
      label: "",
      detail: "",
      state: "",
      createDate: "",
      folderId: 0,
      history: [
        {
          historyId: 0,
          updateDate: "",
        },
      ],
    });

    setUpdateHistory({
      historyId: 0,
      updateDate: "",
      updateLabel: "",
      updateDetail: "",
    });
  };

  const onBackClick = () => {
    clearData();
    router.push("/");
  };

  const onUpdateClick = () => {
    updateTodoItem.folderId = selectedFolder.id;
    updateTodoItem.state = selectedState.name;
    // create history
    if (updateTodoItem.history.length <= 0) {
      updateHistory.historyId = 0;
    } else {
      updateHistory.historyId =
        updateTodoItem.history[updateTodoItem.history.length - 1].historyId + 1;
    }
    updateHistory.updateDate = new Date().toISOString().slice(0, 10);

    //update history log
    for (const item of updateTodoItem.history) {
      if (item.historyId !== updateHistory.historyId) {
        updateTodoItem.history = [...updateTodoItem.history, updateHistory];
        break;
      }
    }

    //save edit to storage
    const validUpdateTodoItem = validateUpdateTodoItem();

    if (validUpdateTodoItem) {
      const todoList = JSON.parse(localStorage.getItem("todoList") || "[]");
      todoList.map((itemTodo: Todo, index: number) => {
        if (itemTodo.id == updateTodoItem.id) {
          todoList.splice(index, 1, updateTodoItem);
        }
      });

      localStorage.setItem("todoList", JSON.stringify(todoList));

      const folderListStorage = JSON.parse(
        localStorage.getItem("folderList") || "[]"
      );

      folderListStorage.map((folder: Folder) => {
        if (folder.id !== updateTodoItem.folderId) {
          folder.todoItemArray.map((todoItem: number, index: number) => {
            if (todoItem == updateTodoItem.id) {
              folder.todoItemArray.splice(index, 1);
            }
          });
        } else {
          if (folder.todoItemArray.indexOf(updateTodoItem.id) < 0) {
            folder.todoItemArray = [...folder.todoItemArray, updateTodoItem.id];
          }
        }
      });

      localStorage.setItem("folderList", JSON.stringify(folderListStorage));

      alert(t("content.Update successfull"));

      setTodoStorageChange(true);
    }
  };

  const validateUpdateTodoItem = () => {
    return true;
  };

  useEffect(() => {
    if (todoItem !== null) {
      setSelectedState({
        name: todoItem.state,
      });
    }
  }, [setSelectedState, todoItem]);

  useEffect(() => {
    const folderListStorage = JSON.parse(
      localStorage.getItem("folderList") || "[]"
    );

    if (todoItem !== null) {
      folderListStorage.map((folder: Folder) => {
        if (folder.id == todoItem.folderId) {
          setSelectedFolder(folder);
        }
      });
    }
  }, [setSelectedFolder, todoItem]);

  useEffect(() => {
    if (todoItem !== null) {
      setUpdateTodoItem({
        ...updateTodoItem,
        id: todoItem.id,
        label: todoItem.label,
        detail: todoItem.detail,
        state: selectedState.name,
        createDate: todoItem.createDate,
        folderId: todoItem.folderId,
        history: todoItem.history,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoItem]);

  useEffect(() => {
    const arrayTodoList = JSON.parse(localStorage.getItem("todoList") || "[]");
    arrayTodoList.map((item: Todo) => {
      if (item.id == itemId) {
        setTodoItem(item);
      }
    });
  }, [itemId]);

  return (
    <div className="padding-class">
      <div className="flex">
        <div className="w-3/4">
          <input
            type="text"
            onChange={onChangeLabel}
            value={todoItem.label}
            className="w-full mb-3 text-lg font-medium"
          />
        </div>
        <div className="w-1/4">
          <p className="mb-3 font-thin text-blue-500 text-right">
            Create Date: {todoItem.createDate}
          </p>
        </div>
      </div>
      {todoItem !== null ? (
        <>
          <TodoStateOfItem />
          <FolderSelect />
        </>
      ) : null}
      <div className="sm:flex sm:items-start">
        <form className="w-full">
          <div className="w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex justify-between items-center py-2 px-3 border-b dark:border-gray-600">
              <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
                <div className="flex items-center space-x-1 sm:pr-4">
                  <button
                    type="button"
                    className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Attach file</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Embed map</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Upload image</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Format code</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Add emoji</span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
                  <button
                    type="button"
                    className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Add list</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Settings</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Timeline</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Download</span>
                  </button>
                </div>
              </div>
              <button
                type="button"
                data-tooltip-target="tooltip-fullscreen"
                className="p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Full screen</span>
              </button>
              <div
                id="tooltip-fullscreen"
                role="tooltip"
                className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700"
                data-popper-reference-hidden=""
                data-popper-placement="top"
              >
                Show full screen
                <div className="tooltip-arrow" data-popper-arrow=""></div>
              </div>
            </div>
            <div className="py-2 px-4 bg-white rounded-b-lg dark:bg-gray-800">
              <label htmlFor="editIdDetail" className="sr-only">
                Publish post
              </label>
              <textarea
                onChange={onChangeTodoDetail}
                defaultValue={todoItem.detail}
                rows={15}
                className="block px-0 w-full text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write an article..."
              ></textarea>
            </div>
          </div>
        </form>
      </div>
      <div className="py-3 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={onUpdateClick}
        >
          Update
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={onBackClick}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default TodoDetail;
