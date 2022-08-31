import { atom } from "recoil";

export const selectFolder = atom({
    key: "selectFolder",
    default: {
        id: 0,
        name: "Default Folder"
    }
});