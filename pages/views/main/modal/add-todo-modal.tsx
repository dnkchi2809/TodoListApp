/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect, Fragment, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { openAddTodoModal } from "../../../../recoil/open-add-todo-modal";
import { Transition } from "@headlessui/react";
import FolderSelect from "../../folder/folder-item/folder-select";
import { selectFolder } from "../../../../recoil/select-folder";
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

function AddTodoModal() {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const setTodoStorageChange = useSetRecoilState(todoLocalStorageChange);

  const [selectedFolder, setSelectedFolder] = useRecoilState(selectFolder);

  const [newTodoItem] = useState({
    id: 0,
    label: "",
    detail: "",
    state: "Todo",
    createDate: "",
    folderId: 0,
    history: [
      {
        historyId: 0,
        updateDate: "",
      },
    ],
  });

  const [openModalAddTodo, setOpenModalAddTodo] =
    useRecoilState(openAddTodoModal);

  const idLabel = useRef<HTMLInputElement>(null);
  const idDetail = useRef<HTMLTextAreaElement>(null);

  const clearData = () => {
    idLabel.current!.value = "";
    idDetail.current!.value = "";
  };

  const onCancelClick = () => {
    clearData();
    setOpenModalAddTodo(false);
    setSelectedFolder({
      id: 0,
      name: "Default Folder",
    });
  };

  const onInputLabelTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    newTodoItem.label = event.target.value;
    newTodoItem.createDate = new Date().toISOString().slice(0, 10);
  };

  const onInputDetailTodo = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    newTodoItem.detail = event.target.value;
  };

  const onSaveNewTodo = () => {
    const validTodo = validateNewTodoItem(newTodoItem);

    let arrayTempTodo = [];
    const todoListStorage = JSON.parse(
      localStorage.getItem("todoList") || "[]"
    );
    arrayTempTodo = todoListStorage;

    const folderListStorage = JSON.parse(
      localStorage.getItem("folderList") || "[]"
    );

    if (validTodo) {
      if (todoListStorage.length <= 0) {
        newTodoItem.id = 0;
      } else {
        newTodoItem.id = todoListStorage[todoListStorage.length - 1].id + 1;
      }

      arrayTempTodo.push(newTodoItem);

      localStorage.setItem("todoList", JSON.stringify(arrayTempTodo));

      folderListStorage.map((folder: Folder) => {
        if (folder.id == newTodoItem.folderId) {
          folder.todoItemArray.push(newTodoItem.id);
        }
      });

      localStorage.setItem("folderList", JSON.stringify(folderListStorage));
      setTodoStorageChange(true);
      onCancelClick();
    }
  };

  const validateNewTodoItem = (paramItem: Todo) => {
    if (paramItem.label == "") {
      alert(t("content.Label is invalid"));
      return false;
    }
    return true;
  };

  useEffect(() => {
    newTodoItem.folderId = selectedFolder.id;
    setIsOpen(openModalAddTodo);
  }, [newTodoItem, selectedFolder.id, openModalAddTodo]);
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
                  <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <input
                          ref={idLabel}
                          placeholder={t("content.To Do Label")}
                          className="w-full mb-3 text-lg font-medium"
                          onInput={onInputLabelTodo}
                        />
                      </div>
                      <FolderSelect />
                      <div className="sm:flex sm:items-start">
                        <form className="w-full">
                          <div className="w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                            <div className="py-2 px-4 bg-white rounded-b-lg dark:bg-gray-800">
                              <label htmlFor="idDetail" className="sr-only">
                                Publish post
                              </label>
                              <textarea
                                ref={idDetail}
                                rows={10}
                                className="block px-0 w-full text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                                placeholder={t("content.Write an article...")}
                                onInput={onInputDetailTodo}
                              ></textarea>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        data-modal-toggle="addModal"
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={onSaveNewTodo}
                      >
                        {t("content.Save")}
                      </button>
                      <button
                        data-modal-toggle="addModal"
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

export default AddTodoModal;
