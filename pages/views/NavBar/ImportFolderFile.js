import { useState } from "react";

function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event) {
    var obj = JSON.parse(event.target.result);
    addDataToStorage(obj);
}

function addDataToStorage(data) {
    var arrayTempFolder = [];
    var folderListStorage = JSON.parse(localStorage.getItem("folderList")) || [];
    arrayTempFolder = folderListStorage;

    data.map((dataItem, index) => {
        let newFolderItem = {
            id: 0,
            name: "",
            createDate: "",
            todoItemArray: Array()
        }

        if (folderListStorage.length <= 0) {
            newFolderItem.id = 0;
        }
        else {
            newFolderItem.id = folderListStorage[(folderListStorage.length - 1)].id + index + 1;
        }
        newFolderItem.name = dataItem.name;
        newFolderItem.createDate = new Date().toISOString().slice(0, 10);
        newFolderItem.todoItemArray = Array();

        const validFolder = validateNewFolderItem(newFolderItem, index);

        if (validFolder) {
            arrayTempFolder = [...arrayTempFolder, newFolderItem]
        }
    });

    if (arrayTempFolder !== []) {
        localStorage.setItem("folderList", JSON.stringify(arrayTempFolder));
        alert("Successfull import folder!")
    }
}

const validateNewFolderItem = (paramItem, paramIndex) => {
    if (paramItem.label == "") {
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

