import { useState, useEffect, Fragment } from "react";
import { useRecoilState } from "recoil";
import { Transition } from "@headlessui/react";
import { openImportModal } from "../../../../recoil/open-import-modal";
import { ImportTodoFile } from "../../../../action/import-todo-file";
import { ImportFolderFile } from "../../../../action/import-folder-file";
import { useTranslation } from "react-i18next";
import { Dialog } from "@headlessui/react";

function ImportModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const [importModal, setImportModal] = useRecoilState(openImportModal);

  function onCancelClick() {
    setImportModal(false);
  }

  const onImportTodoClick = () => {
    ImportTodoFile();
  };

  const onImportFolderClick = () => {
    ImportFolderFile();
  };

  useEffect(() => {
    setIsOpen(importModal);
  }, [importModal]);

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
                      <div className="flex items-center justify-center p-5">
                        <div className="w-1/2" onClick={onImportTodoClick}>
                          <div
                            id="image-note"
                            className="image-import px-3 py-4 w-full h-40 flex justify-center items-center text-white"
                            title="Import Todo"
                          />
                          <div className="text-center">
                            {t("content.Import Todo")}
                          </div>
                        </div>
                        <div className="w-1/2" onClick={onImportFolderClick}>
                          <div
                            id="image-folder"
                            className="image-import px-3 py-4 w-full h-40 flex justify-center items-center text-white"
                            title="Import Folder"
                          />
                          <div className="text-center">
                            {t("content.Import Folder")}
                          </div>
                        </div>
                      </div>
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

export default ImportModal;
