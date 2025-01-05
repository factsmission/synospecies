import type { AuthorizedName, Name } from "@plazi/synolib";

export function nameToID(name: Name): string {
  return encodeURIComponent(`${name.kingdom}__${name.displayName}`);
}

export function authNameToID(authName: AuthorizedName): string {
  return encodeURIComponent(`__${authName.displayName}_${authName.authority}`);
}
