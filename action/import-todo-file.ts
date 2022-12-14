/* eslint-disable @typescript-eslint/no-explicit-any */
interface DataItem {
  id: number;
  label: string;
  detail: string;
  createDate: string;
  state: string;
  folderId: number;
  history: [
    {
      historyId: number;
      updateDate: string;
    }
  ];
}

interface Folder {
  id: number;
  todoItemArray: number[];
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
  const todoListStorage = JSON.parse(localStorage.getItem("todoList") || "[]");

  const folderListStorage: [] = JSON.parse(
    localStorage.getItem("folderList") || "[]"
  );

  const arrayTempTodo: DataItem[] = todoListStorage;

  data.map((dataItem: DataItem, index) => {
    const newTodoItem: DataItem = {
      id: 0,
      label: "",
      detail: "",
      createDate: "",
      state: "",
      folderId: 0,
      history: [
        {
          historyId: 0,
          updateDate: "",
        },
      ],
    };

    if (todoListStorage.length == 0) {
      newTodoItem.id = 0;
    } else {
      newTodoItem.id = todoListStorage[todoListStorage.length - 1].id + 1;
    }
    newTodoItem.label = dataItem.label;
    newTodoItem.detail = dataItem.detail;
    newTodoItem.createDate = new Date().toISOString().slice(0, 10);
    newTodoItem.folderId = dataItem.folderId;
    newTodoItem.state = dataItem.state;
    newTodoItem.history = [
      {
        historyId: 0,
        updateDate: "",
      },
    ];

    const validTodo = validateNewTodoItem(newTodoItem, index);

    if (validTodo) {
      arrayTempTodo.push(newTodoItem);
    }

    folderListStorage.map((folder: Folder) => {
      if (folder.id == newTodoItem.folderId) {
        folder.todoItemArray.push(newTodoItem.id);
      }
    });
  });

  if (arrayTempTodo.length > 0) {
    localStorage.setItem("todoList", JSON.stringify(arrayTempTodo));
    localStorage.setItem("folderList", JSON.stringify(folderListStorage));
    alert("Successfull import!");
  }
}

const validateNewTodoItem = (paramItem: DataItem, paramIndex: number) => {
  if (paramItem.label == "") {
    alert("Label item index " + paramIndex + " is invalid");
    return false;
  }
  return true;
};

export const ImportTodoFile = () => {
  const linkElement = document.createElement("input");
  linkElement.setAttribute("type", "file");
  linkElement.setAttribute("accept", ".json");
  linkElement.click();
  linkElement.addEventListener("change", onChange);
};
