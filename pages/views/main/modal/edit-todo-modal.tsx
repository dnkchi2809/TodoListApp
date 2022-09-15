import { useState, useEffect, Fragment } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { openEditTodoModal } from "../../../../recoil/open-edit-todo-modal";
import { todoItemSelect } from "../../../../recoil/todo-item-select";
import { Transition } from "@headlessui/react";
import FolderSelect from "../../folder/folder-item/folder-select";
import { selectFolder } from "../../../../recoil/select-folder";
import { selectStateOfItem } from "../../../../recoil/select-state-of-item";
import TodoStateOfItem from "../todo-item/todo-state-of-item";
import { todoLocalStorageChange } from "../../../../recoil/todo-localstorage-change";
import { Dialog } from "@headlessui/react";
import { useTranslation } from "react-i18next";

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

function EditTodoModal() {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const setTodoStorageChange = useSetRecoilState(todoLocalStorageChange);
  const [openModalEditTodo, setOpenModalEditTodo] =
    useRecoilState(openEditTodoModal);
  const [selectItem, setSelectItem] = useRecoilState(todoItemSelect);

  const [selectedFolder, setSelectedFolder] = useRecoilState(selectFolder);
  const [selectedState, setSelectedState] = useRecoilState(selectStateOfItem);

  const [updateTodoItem, setUpdateTodoItem] = useState({
    id: 0,
    label: "",
    detail: "",
    createDate: "",
    state: selectedState.name,
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

  const onCancelClick = () => {
    setOpenModalEditTodo(false);
    setUpdateHistory({
      historyId: 0,
      updateDate: "",
      updateLabel: "",
      updateDetail: "",
    });
    setSelectItem({
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
    setSelectedFolder({
      id: 0,
      name: "Default Folder",
    });
  };

  const onSaveClick = () => {
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
    const validUpdateTodoItem = validateUpdateTodoItem(updateTodoItem);

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
      setTodoStorageChange(true);
      onCancelClick();
    }
  };

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

  const validateUpdateTodoItem = (paramItem: Todo) => {
    if (paramItem.label == "") {
      alert(t("content.Label is invalid"));
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (selectItem !== null) {
      setSelectedState({
        name: selectItem.state,
      });
    }
  }, [selectItem, setSelectedState]);

  useEffect(() => {
    const folderListStorage = JSON.parse(
      localStorage.getItem("folderList") || "[]"
    );

    if (selectItem !== null) {
      folderListStorage.map((folder: Folder) => {
        if (folder.id == selectItem.folderId) {
          setSelectedFolder(folder);
        }
      });
    }
  }, [selectItem, setSelectedFolder]);

  useEffect(() => {
    if (selectItem !== null) {
      setUpdateTodoItem({
        ...updateTodoItem,
        id: selectItem.id,
        label: selectItem.label,
        detail: selectItem.detail,
        state: selectedState.name,
        createDate: selectItem.createDate,
        folderId: selectItem.id,
        history: selectItem.history,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectItem]);

  useEffect(() => {
    setIsOpen(openModalEditTodo);
  }, [openModalEditTodo]);
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onCancelClick}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-blue-300 w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="relative text-left overflow-hidden shadow-xl transform transition-all rounded-2xl sm:my-8 sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
                      <div className="flex">
                        <div className="w-3/4">
                          <input
                            type="text"
                            id="editModalLabel"
                            onChange={onChangeLabel}
                            defaultValue={updateTodoItem.label}
                            className="w-full mb-3 text-lg font-medium"
                          />
                        </div>
                        <div className="w-1/4">
                          <p className="mb-3 font-thin text-blue-500 text-right">
                            {updateTodoItem.createDate}
                          </p>
                        </div>
                      </div>
                      <TodoStateOfItem />
                      <FolderSelect />
                      <div className="sm:flex sm:items-start">
                        <form className="w-full">
                          <div className="w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                            <div className="py-2 px-4 bg-white rounded-b-lg dark:bg-gray-800">
                              <label htmlFor="editIdDetail" className="sr-only">
                                Publish post
                              </label>
                              <textarea
                                onChange={onChangeTodoDetail}
                                defaultValue={updateTodoItem.detail}
                                rows={10}
                                className="block px-0 w-full text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                                placeholder={t("content.Write an article...")}
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        data-modal-toggle="editModal"
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={onSaveClick}
                      >
                        {t("content.Save")}
                      </button>
                      <button
                        data-modal-toggle="editModal"
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={onCancelClick}
                      >
                        {t("content.Cancel")}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default EditTodoModal;
