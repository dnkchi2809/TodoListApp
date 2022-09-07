import { atom } from "recoil";

export const todoItemSelect = atom({
  key: "todoItemSelect",
  default: {
    id: 0,
    label: "",
    detail: "",
    createDate: "",
    state: "",
    folderId: 0,
    history: [{
      historyId: 0,
      updateDate: ""
    }]
  }
});