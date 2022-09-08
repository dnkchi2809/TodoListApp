interface DataItem {
    id: number,
    name: string,
    createDate : string,
    todoItemArray : []
}

function onChange(event: any) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event: any) {
    var obj = JSON.parse(event.target.result);
    addDataToStorage(obj);
}

function addDataToStorage(data: []) {
    var arrayTempFolder: [DataItem];
    // @ts-ignore
    var folderListStorage = JSON.parse(localStorage.getItem("folderList")) || [];
    arrayTempFolder = folderListStorage;

    data.map((dataItem: DataItem, index) => {
        let newFolderItem: DataItem = {
            id: 0,
            name: "",
            createDate: "",
            todoItemArray: []
        }

        if (folderListStorage.length <= 0) {
            newFolderItem.id = 0;
        }
        else {
            newFolderItem.id = folderListStorage[(folderListStorage.length - 1)].id + 1;
        }
        newFolderItem.name = dataItem.name;
        newFolderItem.createDate = new Date().toISOString().slice(0, 10);
        newFolderItem.todoItemArray = [];

        const validFolder = validateNewFolderItem(newFolderItem, index);

        if (validFolder) {
            arrayTempFolder.push(newFolderItem)
        }
    });

    if (arrayTempFolder.length > 0) {
        localStorage.setItem("folderList", JSON.stringify(arrayTempFolder));
        alert("Successfull import folder!")
    }
}

const validateNewFolderItem = (paramItem : DataItem, paramIndex : number) => {
    if (paramItem.name == "") {
        alert("Folder name index " + paramIndex + " is invalid");
        return false
    }
    return true;
}

export const ImportFolderFile = () => {
    let linkElement = document.createElement('input');
    linkElement.setAttribute('type', "file");
    linkElement.click();
    linkElement.addEventListener('change', onChange);
}

