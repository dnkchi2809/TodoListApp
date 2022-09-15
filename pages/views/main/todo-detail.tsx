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
