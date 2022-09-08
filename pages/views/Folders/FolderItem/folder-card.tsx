import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { selectAllFolders } from "../../../../Recoil/select-all-folders";
import { selectArrayFolders } from "../../../../Recoil/select-array-folders";

interface Folder {
    id: number,
    name: string,
    createDate : string,
    todoItemArray : []
}

function FolderCard(props : Folder) {
    const router = useRouter();

    const [arrayFolder, setArrayFolder] = useRecoilState(selectArrayFolders);
    const [selectAll, setSelectAll] = useRecoilState(selectAllFolders);

    const onFolderCardClick = () => {
        router.push({
            pathname: '/folders/[folderItemId]',
            query: { folderItemId: props.id },
        }).then(() => {
            router.reload();
        })
    };

    const onSelectFolderClick = () => {
      
        setSelectAll(false);
        
        const folder = document.getElementById(String(props.id)) as HTMLFormElement;

        if (folder.checked) {
            let newArrayFolder = arrayFolder;
            newArrayFolder = [...arrayFolder, Number(folder.id)];
            setArrayFolder(newArrayFolder);
        }
        else {
            let newArrayFolders = [];
            newArrayFolders = arrayFolder.filter((element) => {
                return Number(element) !== Number(folder.id)
            })
            setArrayFolder(newArrayFolders);
        }
    };

    useEffect(() => {
        let item = document.getElementById(String(props.id)) as HTMLFormElement;
        if (selectAll) {
            item.checked = true;
        }
        else if (arrayFolder.length == 0) {
            item.checked = false;
        }
    }, [selectAll])

    return (
        <>
            <div className="w-full h-full px-3 py-5 folder-card text-white">
                <div>
                    <input id={String(props.id)} type="checkbox" onClick={onSelectFolderClick} className="selectItemClass w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="text-center" onClick={onFolderCardClick}>
                    <p>{props.name}</p>
                    <p>Todo : {props.todoItemArray.length}</p>

                </div>
            </div>
        </>
    )
}

export default FolderCard;