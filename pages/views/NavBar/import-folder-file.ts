/* eslint-disable @typescript-eslint/no-explicit-any */
interface DataItem {
  id: number;
  name: string;
  createDate: string;
  todoItemArray: [];
}

function onChange(event: any) {
  const reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event: any) {
  try {
    const obj = JSON.parse(event.target.result);
    addDataToStorage(obj);
  } catch (err) {
    alert("File input invalid");
  }
}

function addDataToStorage(data: []) {
  const folderListStorage = JSON.parse(
    localStorage.getItem("folderList") || "[]"
  );

  const arrayTempFolder: [DataItem] = folderListStorage;

  data.map((dataItem: DataItem, index) => {
    const newFolderItem: DataItem = {
      id: 0,
      name: "",
      createDate: "",
      todoItemArray: [],
    };

    if (folderListStorage.length <= 0) {
      newFolderItem.id = 0;
    } else {
      newFolderItem.id = folderListStorage[folderListStorage.length - 1].id + 1;
    }
    newFolderItem.name = dataItem.name;
    newFolderItem.createDate = new Date().toISOString().slice(0, 10);
    newFolderItem.todoItemArray = [];

    const validFolder = validateNewFolderItem(newFolderItem, index);

    if (validFolder) {
      arrayTempFolder.push(newFolderItem);
    }
  });

  if (arrayTempFolder.length > 0) {
    localStorage.setItem("folderList", JSON.stringify(arrayTempFolder));
    alert("Successfull import folder!");
  }
}

const validateNewFolderItem = (paramItem: DataItem, paramIndex: number) => {
  if (paramItem.name == "") {
    alert("Folder name index " + paramIndex + " is invalid");
    return false;
  }
  return true;
};

export const ImportFolderFile = () => {
  const linkElement = document.createElement("input");
  linkElement.setAttribute("type", "file");
  linkElement.setAttribute("accept", ".json");
  linkElement.click();
  linkElement.addEventListener("change", onChange);
};
