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
    var arrayTempTodo = [];
    var todoListStorage = JSON.parse(localStorage.getItem("todoList")) || [];
    var folderListStorage = JSON.parse(localStorage.getItem("folderList")) || [];
    arrayTempTodo = todoListStorage;

    data.map((dataItem, index) => {
        let newTodoItem = {
            id: 0,
            label: "",
            detail: "",
            createDate: "",
            state: "",
            folderId: 0,
            history: Array({
                historyId: 0,
                updateDate: ""
            })
        }

        if (todoListStorage.length == 0) {
            newTodoItem.id = 0 + index;
        }
        else {
            newTodoItem.id = todoListStorage[(todoListStorage.length - 1)].id + index + 1;
        }
        newTodoItem.label = dataItem.label;
        newTodoItem.detail = dataItem.detail;
        newTodoItem.createDate = new Date().toISOString().slice(0, 10);
        newTodoItem.folderId = dataItem.folderId;
        newTodoItem.state = dataItem.state;
        newTodoItem.history = Array({
            historyId: 0,
            updateDate: ""
        });

        const validTodo = validateNewTodoItem(newTodoItem, index);

        if (validTodo) {
            arrayTempTodo = [...arrayTempTodo, newTodoItem]
        }

        folderListStorage.map((folder) => {
            if (folder.id == newTodoItem.folderId){
                folder.todoItemArray.push(newTodoItem.id);                                                                                                                                            
            }                  
        });

    });

    if (arrayTempTodo !== []) {
        localStorage.setItem("todoList", JSON.stringify(arrayTempTodo));
        localStorage.setItem("folderList", JSON.stringify(folderListStorage));
        alert("Successfull import!")
    }
}

const validateNewTodoItem = (paramItem, paramIndex) => {
    if (paramItem.label == "") {
        alert("Label item index " + paramIndex + " is invalid");
        return false
    }
    return true;
}

export const ImportTodoFile = () => {
    let linkElement = document.createElement('input');
    linkElement.setAttribute('type', "file");
    linkElement.click();
    linkElement.addEventListener('change', onChange);
}

