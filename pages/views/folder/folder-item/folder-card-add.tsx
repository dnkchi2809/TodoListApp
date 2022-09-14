import { useSetRecoilState } from "recoil";
import { openAddFolderModal } from "../../../../recoil/openn-add-folder-modal";
import AddFolderModal from "../modal/add-folder-modal";
import { useTranslation } from 'react-i18next';

function FolderCardAdd() {
  const { t } = useTranslation();

  const setOpenModalAddFolder = useSetRecoilState(openAddFolderModal);

  const onAddFolderClick = () => {
    setOpenModalAddFolder(true);
  };

  return (
    <>
      <div className="px-3 py-5 w-full h-full folder-card">
        <button
          className="w-full h-full rounded flex justify-center items-center py-2"
          type="button"
          onClick={onAddFolderClick}
          title={t('content.Add New Folder')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v18m9-9H3"
            />
          </svg>
        </button>
      </div>

      <AddFolderModal />
    </>
  );
}

export default FolderCardAdd;
