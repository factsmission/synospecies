export type EndpointInfo = {
  url: string;
  name: string;
  note?: string;
};

/** The SPARQL endpoints known to serve the Plazi treatment data. */
export const ENDPOINTS: EndpointInfo[] = [
  { url: "https://qlever.ld.plazi.org/sparql", name: "Qlever", note: "NEW" },
  { url: "https://cached.lindas.admin.ch/query", name: "Lindas" },
  { url: "https://lindas.cz-aws.net/query", name: "Lindas uncached" },
  {
    url: "https://treatment.ld.plazi.org/sparql",
    name: "Plazi",
    note: "Most up-to-date",
  },
];

export const DEFAULT_ENDPOINT = "https://cached.lindas.admin.ch/query";

const STORAGE_KEY = "plazi-treatments-endpoint";

export function isKnownEndpoint(url: string): boolean {
  return ENDPOINTS.some((e) => e.url === url);
}

/** Only absolute http(s) URLs are accepted as SPARQL endpoints. */
export function isValidEndpoint(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

/** The endpoint chosen on the settings page, or the default. */
export function getStoredEndpoint(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidEndpoint(stored)) return stored;
  } catch {
    // localStorage may be unavailable (e.g. blocked site data)
  }
  return DEFAULT_ENDPOINT;
}

/** Persists the endpoint, or resets to the default if `url` is null. */
export function setStoredEndpoint(url: string | null) {
  try {
    if (url === null || url === DEFAULT_ENDPOINT) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, url);
    }
  } catch {
    // localStorage may be unavailable (e.g. blocked site data)
  }
}

/**
 * The endpoint to use for the current page: the `server` URL parameter takes
 * precedence over the endpoint chosen on the settings page.
 */
export function getEndpoint(): string {
  const param = new URLSearchParams(document.location.search).get("server");
  if (param && isValidEndpoint(param)) return param;
  return getStoredEndpoint();
}
