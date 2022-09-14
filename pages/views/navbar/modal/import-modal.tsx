import { useState, useEffect, Fragment, useRef } from "react";
import { useRecoilState } from "recoil";
import { Transition } from "@headlessui/react";
import { useTimeoutFn } from "react-use";
import { openImportModal } from "../../../../recoil/open-import-modal";
import { ImportTodoFile } from "../../../../action/import-todo-file";
import { ImportFolderFile } from "../../../../action/import-folder-file";
import { useTranslation } from "react-i18next";

function ImportModal() {
  const { t } = useTranslation();

  const [isShowing, setIsShowing] = useState(false);
  const [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);

  const [importModal, setImportModal] = useRecoilState(openImportModal);

  const idImportModal = useRef<HTMLDivElement>(null);

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
    if (importModal) {
      idImportModal.current?.classList.remove("hidden");
      setIsShowing(true);
      resetIsShowing();
    } else {
      setIsShowing(false);
      resetIsShowing();
      idImportModal.current?.classList.add("hidden");
    }
  }, [importModal, resetIsShowing]);

  return (
    <>
      <div
        ref={idImportModal}
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
        onClick={onCancelClick}
      >
        <div className="fixed inset-0 bg-gray-200 bg-opacity-70 transition-opacity" />

        <Transition
          as={Fragment}
          show={isShowing}
          enter="transform transition duration-[4000ms] linear"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100 scale-100 "
          leaveTo="opacity-0 scale-50 "
        >
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
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
            </div>
          </div>
        </Transition>
      </div>
    </>
  );
}

export default ImportModal;
