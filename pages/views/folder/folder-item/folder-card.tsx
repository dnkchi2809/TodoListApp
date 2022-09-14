import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { selectAllFolders } from "../../../../recoil/select-all-folders";
import { selectArrayFolders } from "../../../../recoil/select-array-folders";

interface Folder {
  id: number;
  name: string;
  createDate: string;
  todoItemArray: [];
}

function FolderCard(props: Folder) {
  const router = useRouter();

  const [arrayFolder, setArrayFolder] = useRecoilState(selectArrayFolders);
  const [selectAll, setSelectAll] = useRecoilState(selectAllFolders);

  const inputSelectFolder = useRef<HTMLInputElement>(null);
  const [checkedInput, setCheckedInput] = useState(false);

  const onFolderCardClick = () => {
    router
      .push({
        pathname: "/folders/[folderItemId]",
        query: { folderItemId: props.id },
      });
  };

  const onSelectFolderClick = () => {
    setSelectAll(false);

    setCheckedInput(!checkedInput);

    if (inputSelectFolder.current?.checked) {
      let newArrayFolder = arrayFolder;
      newArrayFolder = [...arrayFolder, Number(inputSelectFolder.current?.id)];
      setArrayFolder(newArrayFolder);
    } else {
      let newArrayFolders = [];
      newArrayFolders = arrayFolder.filter((element) => {
        return Number(element) !== Number(inputSelectFolder.current?.id);
      });
      setArrayFolder(newArrayFolders);
    }
  };

  useEffect(() => {
    if (selectAll) {
      setCheckedInput(true);
    } else if (Object.keys(arrayFolder).length == 0) {
      setCheckedInput(false);
    }
  }, [arrayFolder, selectAll]);

  return (
    <>
      <div className="w-full h-full px-3 py-5 folder-card text-white">
        <div>
          <input
            ref={inputSelectFolder}
            id={String(props.id)}
            type="checkbox"
            checked={checkedInput}
            value={props.id}
            onChange={onSelectFolderClick}
            className="selectItemClass w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div className="text-center" onClick={onFolderCardClick}>
          <p>{props.name}</p>
          <p>Todo : {props.todoItemArray !== undefined ? props.todoItemArray.length : null}</p>
        </div>
      </div>
    </>
  );
}

export default FolderCard;
