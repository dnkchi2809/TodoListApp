import { atom } from "recoil";

export const selectArrayItems = atom({
  key: "selectArrayItems",
  default: [] as number[]
});