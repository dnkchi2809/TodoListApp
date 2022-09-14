import { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { openImportModal } from "../../../recoil/open-import-modal";
import { selectArrayFolders } from "../../../recoil/select-array-folders";
import { selectArrayItems } from "../../../recoil/select-many-items";
import { ExportFile } from "../../../action/export-todo-file";
import ImportModal from "../Navbar1/modal/import-modal";
import Link from "next/link";
import { pageNavigate } from "../../../recoil/page-navigate";
import { useRouter } from "next/router";

interface itemSelect {
  id: number;
}

function NavBar() {
  const router = useRouter();
  const [arrayItems] = useRecoilState(selectArrayItems);
  const [arrayFolder] = useRecoilState(selectArrayFolders);

  const [selectedPage] = useRecoilState(pageNavigate);

  const [dataType, setDataType] = useState(0);

  const setImportModal = useSetRecoilState(openImportModal);

  const [allData, setAllData] = useState([]);

  const homeLink = useRef<HTMLAnchorElement>(null);
  const folderLink = useRef<HTMLAnchorElement>(null);

  const onHomeLinkClick = () => {
    router.push("/");
  };

  const onFolderLinkClick = () => {
    router.push("/folders");
  };

  const dataSelected: itemSelect[] = [];

  allData.map((itemData: itemSelect) => {
    if (dataType == 0) {
      arrayItems.map((item) => {
        if (item == itemData.id) {
          dataSelected.push(itemData);
        }
      });
    } else {
      arrayFolder.map((folder) => {
        if (folder == itemData.id) {
          dataSelected.push(itemData);
        }
      });
    }
  });

  const onExportClick = () => {
    ExportFile(JSON.stringify(dataSelected));
  };

  const onImportClick = () => {
    setImportModal(true);
  };

  useEffect(() => {
    if (selectedPage == "folder") {
      folderLink.current?.classList.add("text-blue-700");
      homeLink.current?.classList.remove("text-blue-700");
    } else {
      homeLink.current?.classList.add("text-blue-700");
      folderLink.current?.classList.remove("text-blue-700");
    }
  }, [selectedPage]);

  useEffect(() => {
    if (arrayItems.length > 0) {
      setAllData(JSON.parse(localStorage.getItem("todoList") || "[]"));
      setDataType(0);
    }
    if (arrayFolder.length > 0) {
      setAllData(JSON.parse(localStorage.getItem("folderList") || "[]"));
      setDataType(1);
    }
  }, [arrayItems, arrayFolder]);

  return (
    <>
      <nav className="px-2 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="container flex flex-wrap justify-end items-end mx-auto">
          <button
            data-collapse-toggle="mobile-menu"
            type="button"
            className="inline-flex justify-center items-center ml-3 text-gray-400 rounded-lg md:hidden hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:text-gray-400 dark:hover:text-white dark:focus:ring-gray-500"
            aria-controls="mobile-menu-2"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="mobile-menu">
            <ul className="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link href="/">
                  <a
                    ref={homeLink}
                    className="text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    onClick={onHomeLinkClick}
                  >
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/folders">
                  <a
                    ref={folderLink}
                    onClick={onFolderLinkClick}
                    className="text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Folders
                  </a>
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  onClick={onImportClick}
                  className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Import
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={onExportClick}
                  className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Export
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <ImportModal />
    </>
  );
}

export default NavBar;
