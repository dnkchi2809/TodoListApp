import { useState, useEffect, Fragment } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Transition } from "@headlessui/react";
import { openAddFolderModal } from "../../../../recoil/openn-add-folder-modal";
import { folderLocalStorageChange } from "../../../../recoil/folder-localstorage-change";
import { Dialog } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

function AddFolderModal(): JSX.Element {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const setFolderStorageChange = useSetRecoilState(folderLocalStorageChange);

  const [newFolderItem] = useState({
    id: 0,
    name: "",
    createDate: "",
    todoItemArray: [],
  });

  const [openModalAddFolder, setOpenModalAddFolder] =
    useRecoilState(openAddFolderModal);

  const onChangeFolderName = (event: React.ChangeEvent<HTMLInputElement>) => {
    newFolderItem.name = event.target.value;
  };

  const onCancelClick = () => {
    setOpenModalAddFolder(false);
  };

  const onCreateFolderClick = () => {
    const validFolder = true;

    let arrayTempFolder = [];
    const folderListStorage = JSON.parse(
      localStorage.getItem("folderList") || "[]"
    );
    arrayTempFolder = folderListStorage;

    if (validFolder) {
      if (folderListStorage.length <= 0) {
        newFolderItem.id = 0;
      } else {
        newFolderItem.id =
          folderListStorage[folderListStorage.length - 1].id + 1;
      }
      newFolderItem.createDate = new Date().toISOString().slice(0, 10);

      arrayTempFolder.push(newFolderItem);

      localStorage.setItem("folderList", JSON.stringify(arrayTempFolder));
      setFolderStorageChange(true);
      onCancelClick();
    }
  };

  useEffect(() => {
    if (openModalAddFolder) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [openModalAddFolder]);

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
                  <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <input
                          id="idLabelFolder"
                          placeholder={t('content.Folder Label')}
                          className="w-full mb-3 text-lg font-medium"
                          onChange={onChangeFolderName}
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        data-modal-toggle="addFolderModal"
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={onCreateFolderClick}
                      >
                        {t('content.Create Folder')}
                      </button>
                      <button
                        data-modal-toggle="addFolderModal"
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={onCancelClick}
                      >
                        {t('content.Cancel')}
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
export default AddFolderModal;
