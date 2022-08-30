function FolderCard(props) {
    return (
        <>
            <div className="px-3 py-4 w-full h-full folder-card flex justify-center items-center text-white">
                <div className="text-center">
                    <p>{props.item.name}</p>
                    <p>Todo : {props.item.todoItemArray.length}</p>
                </div>
            </div>
        </>
    )
}

export default FolderCard;