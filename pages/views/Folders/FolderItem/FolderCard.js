import { useRouter } from "next/router";

function FolderCard(props) {
    const router = useRouter();
    
    const onFolderCardClick = () => {
        router.push({
            pathname: '/folders/[folderItemId]',
            query: { folderItemId: props.item.id },
        }).then(() => {
            router.reload();
        })
    }

    return (
        <>
            <div className="px-3 py-4 w-full h-full folder-card flex justify-center items-center text-white" onClick={onFolderCardClick}>
                <div className="text-center">
                    <p>{props.item.name}</p>
                    <p>Todo : {props.item.todoItemArray.length}</p>
                </div>
            </div>
        </>
    )
}

export default FolderCard;