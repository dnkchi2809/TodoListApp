import { useRecoilState } from "recoil";
import { openAddFolderModal } from "../../../../Recoil/openn-add-folder-modal";
import AddFolderModal from "../Modal/add-folder-modal";

function FolderCardAdd(){
    const [openModalAddFolder, setOpenModalAddFolder] = useRecoilState(openAddFolderModal);

    const onAddFolderClick = () => {
        setOpenModalAddFolder(true);
    }

    return (
        <>
            <div className="px-3 py-5 w-full h-full folder-card">
                <button className="w-full h-full rounded flex justify-center items-center py-2" type="button" onClick={onAddFolderClick} title="Add New Folder">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
                    </svg>
                </button>
            </div>
            
            <AddFolderModal />
        </>
    )
}

export default FolderCardAdd;