import { useState, useEffect, Fragment } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { openDeleteFolderModal } from "../../../../recoil/open-delete-folder-modal";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { folderLocalStorageChange } from "../../../../recoil/folder-localstorage-change";
import { Dialog } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

interface Folder {
  id: number;
  name: string;
  createDate: string;
  todoItemArray: [];
}

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

function DeleteFolderModal(props: Todo) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const setFolderStorageChange = useSetRecoilState(folderLocalStorageChange);

  const folderId = props.folderId;

  const [, setFolderSelect] = useState([]);

  const [todoItemList, setTodoItemList] = useState([]);

  const [deleteFolderModal, setDeleteFolderModal] = useRecoilState(
    openDeleteFolderModal
  );

  const onCancelClick = () => {
    setDeleteFolderModal(false);
  };

  const onConfirmDeleteClick = () => {
    if (todoItemList.length > 0) {
      alert(t('content.Cannot delete Folder having Todo!'));
      onCancelClick();
    } else {
      const folderListStorage = JSON.parse(
        localStorage.getItem("folderList") || "[]"
      );
      const arrayTempFolder: [] = folderListStorage;

      folderListStorage.map((folder: Folder, index: number) => {
        if (folder.id == folderId) {
          arrayTempFolder.splice(index, 1);
        }
      });

      localStorage.setItem("folderList", JSON.stringify(arrayTempFolder));
      setFolderStorageChange(true);

      alert("Delete folder success!");

      onCancelClick();

      router.push("/folders");
    }
  };

  useEffect(() => {
    const folderListStorage = JSON.parse(
      localStorage.getItem("folderList") || "[]"
    );

    setFolderSelect(
      folderListStorage.filter((folder: Folder) => {
        return folder.id == folderId;
      })
    );
  }, [folderId]);

  useEffect(() => {
    if (folderId >= 0) {
      const todoListStorage = JSON.parse(
        localStorage.getItem("todoList") || "[]"
      );

      setTodoItemList(
        todoListStorage.filter((todo: Todo) => {
          return todo.folderId == folderId;
        })
      );
    }
  }, [folderId]);

  useEffect(() => {
    if (deleteFolderModal) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [deleteFolderModal]);
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
                <Dialog.Panel className="bg-blue-500 w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button
                      type="button"
                      className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                      data-modal-toggle="popup-modal"
                      onClick={onCancelClick}
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
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-6 text-center">
                      <svg
                        aria-hidden="true"
                        className="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      {t('content.Are you sure you want to delete this folder?')}
                      </h3>
                      <button
                        data-modal-toggle="popup-modal"
                        type="button"
                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                        onClick={onConfirmDeleteClick}
                      >
                        {t('content.Yes')}
                      </button>
                      <button
                        data-modal-toggle="popup-modal"
                        type="button"
                        className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                        onClick={onCancelClick}
                      >
                        {t('content.No')}
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

export default DeleteFolderModal;
