import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { selectAllFolders } from "../../../recoil/selectAllFolders";
import { selectArrayFolders } from "../../../recoil/selectArrayFolders";

function FolderCard(props) {
    const router = useRouter();

    const [arrayFolder, setArrayFolder] = useRecoilState(selectArrayFolders);
    const [selectAll, setSelectAll] = useRecoilState(selectAllFolders);

    const onFolderCardClick = () => {
        router.push({
            pathname: '/folders/[folderItemId]',
            query: { folderItemId: props.item.id },
        }).then(() => {
            router.reload();
        })
    };

    const onSelectFolderClick = () => {
        setSelectAll(false);
        
        const folder = document.getElementById(props.item.id)

        if (folder.checked) {
            setArrayFolder([...arrayFolder, folder.id])
        }
        else {
            let newArrayFolders = [];
            newArrayFolders = arrayFolder.filter((element) => {
                return element !== folder.id
            })
            setArrayFolder(newArrayFolders);
        }
    };

    useEffect(() => {
        if (selectAll) {
            document.getElementById(props.item.id).checked = true;
        }
        else if (arrayFolder.length == 0) {
            document.getElementById(props.item.id).checked = false;
        }
    }, [selectAll])

    return (
        <>
            <div className="w-full h-full px-3 py-5 folder-card text-white">
                <div>
                    <input id={props.item.id} type="checkbox" onClick={onSelectFolderClick} className="selectItemClass w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="text-center" onClick={onFolderCardClick}>
                    <p>{props.item.name}</p>
                    <p>Todo : {props.item.todoItemArray.length}</p>

                </div>
            </div>
        </>
    )
}

export default FolderCard;