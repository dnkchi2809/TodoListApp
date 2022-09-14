import { atom } from "recoil";

export const selectAllItems = atom({
  key: "selectAllItems",
  default: false,
});
