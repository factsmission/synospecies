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

/**
 * Accepts http(s) URLs, also relative to this page (e.g. a same-origin proxy).
 * On a page served over https, http endpoints would be blocked as mixed
 * content, so only https is accepted there.
 */
export function isValidEndpoint(url: string): boolean {
  if (!url) return false;
  try {
    const { protocol } = new URL(url, document.baseURI);
    if (protocol === "https:") return true;
    return protocol === "http:" && document.location.protocol !== "https:";
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
 *
 * An invalid `server` parameter is returned as is, so that a link fails
 * visibly instead of silently querying a different server than it names.
 */
export function getEndpoint(): string {
  const param = new URLSearchParams(document.location.search).get("server");
  return param || getStoredEndpoint();
}

/**
 * Whether results from this endpoint can be shown without asking: the known
 * endpoints and the one the user chose on the settings page.
 */
export function isTrustedEndpoint(url: string): boolean {
  return isKnownEndpoint(url) || url === getStoredEndpoint();
}

export type TestResult =
  | { state: "running" }
  | { state: "ok"; treatments: boolean }
  | { state: "error"; message: string };

/**
 * Checks that `url` answers SPARQL queries. Resolves to whether the endpoint
 * contains Plazi treatments; rejects if it does not answer with a SPARQL ASK
 * result.
 */
export async function testEndpoint(
  url: string,
  signal?: AbortSignal,
): Promise<boolean> {
  const target = new URL(url, document.baseURI);
  target.searchParams.set(
    "query",
    "ASK { ?treatment a <http://plazi.org/vocab/treatment#Treatment> }",
  );
  const response = await fetch(target, {
    headers: { accept: "application/sparql-results+json" },
    signal,
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  if (typeof json?.boolean !== "boolean") {
    throw new Error("The response is not a SPARQL ASK result");
  }
  return json.boolean;
}
