import { useRecoilState } from "recoil";
import { openAddFolderModal } from "../../../recoil/opennAddFolderModal";
import AddFolderModal from "../Modal/AddFolderModal";

function FolderCardAdd(){
    const [openModalAddFolder, setOpenModalAddFolder] = useRecoilState(openAddFolderModal);

    const onAddFolderClick = () => {
        setOpenModalAddFolder(true);
    }

    return (
        <>
            <div className="px-3 py-5 w-full h-full folder-card">
                <button className="w-full h-full rounded flex justify-center items-center py-2" type="button" onClick={onAddFolderClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" className="w-6 h-6 text-white">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m9-9H3" />
                    </svg>
                </button>
            </div>
            
            <AddFolderModal />
        </>
    )
}

export default FolderCardAdd;