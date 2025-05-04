import type { AuthorizedName, Name } from "@plazi/synolib";

export type NameState = {
  name: Name;
  open: boolean;
  openable: boolean;
  homonym: boolean;

  orderFound: number;
  dateNew: number;
  dateOld: number;

  missingDefines: Set<NonexistentTreatment>;
};

/** A treatment which is implied (by the authority given by others) but does not exist in the data */
export type NonexistentTreatment = {
  date: number;
  creators: string;
  missingDefines: Set<AuthorizedName>;
};
