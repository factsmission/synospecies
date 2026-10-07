import type { AuthorizedName, Name } from "@plazi/synolib";

export function nameToID(name: Name): string {
  return encodeURIComponent(`${name.kingdom}__${name.displayName}`);
}

export function authNameToID(authName: AuthorizedName): string {
  return encodeURIComponent(`__${authName.displayName}_${authName.authority}`);
}

/**
 * Only http(s) URLs are used as link or image targets. URLs come from the
 * SPARQL endpoint, which may be any server the user chose or a link pointed
 * to, so others (e.g. `javascript:`) are dropped.
 */
export function safeUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const { protocol } = new URL(url);
    if (protocol === "https:" || protocol === "http:") return url;
  } catch {
    // not an absolute URL
  }
  return undefined;
}
