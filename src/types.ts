import type { Name } from "@plazi/synolib";

export type NameState = {
  name: Name;
  open: boolean;
  openable: boolean;
  homonym: boolean;

  orderFound: number;
  dateNew: number;
  dateOld: number;
};
