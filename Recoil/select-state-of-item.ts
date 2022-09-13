import { atom } from "recoil";

export const selectStateOfItem = atom({
  key: "selectStateOfItem",
  default: { name: "All" },
});
