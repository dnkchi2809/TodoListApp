import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { SelectorIcon } from "@heroicons/react/solid";
import { selectFolder } from "../../../../recoil/select-folder";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

interface Folder {
  id: number;
  name: string;
  createDate: string;
  todoItemArray: number[];
}

function FolderSelect() {
  const { t } = useTranslation();

  const [folderListStorage, setFolderListStorage] = useState([]);

  const [selectedFolder, setSelectedFolder] = useRecoilState(selectFolder);

  useEffect(() => {
    setFolderListStorage(
      JSON.parse(localStorage.getItem("folderList") || "[]")
    );
  }, [selectedFolder]);

  return (
    <>
      <div className="flex mb-3">
        <div className="w-1/2 flex items-center text-gray-600">
          <p className="">{t("content.Select Folder")}</p>
        </div>
        <div className="w-1/2 flex flex-wrap justify-end items-end mx-auto">
          <Listbox value={selectedFolder} onChange={setSelectedFolder}>
            <div className="relative w-full">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{selectedFolder.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {folderListStorage.map(
                    (folderListStorage: Folder, folderListStorageIndex) => (
                      <Listbox.Option
                        key={folderListStorageIndex}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={folderListStorage}
                      >
                        {(selectedFolder?: unknown) => (
                          <>
                            <span
                              className={`block truncate ${
                                selectedFolder ? "font-medium" : "font-normal"
                              }`}
                            >
                              {folderListStorage.name}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    )
                  )}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
    </>
  );
}

export default FolderSelect;
