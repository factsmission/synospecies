import { SparqlEndpoint, SynonymGroup } from "@plazi/synolib";

import { html, render } from "lit";

import {
  getEndpoint,
  getStoredEndpoint,
  isTrustedEndpoint,
  isValidEndpoint,
} from "./endpoints.ts";
import "./components/SettingsMenu.ts";
import "./components/SynoForm.ts";
import { SynoMain } from "./components/SynoMain.ts";

const params = new URLSearchParams(document.location.search);
const HIDE_COL_ONLY_SYNONYMS = !params.has("show_col");
const START_WITH_SUBTAXA = params.has("subtaxa");
const ENDPOINT_URL = getEndpoint();
const NAME = params.get("q");
const NOSYNONYMS = params.has("nosynonyms");

const sparqlEndpoint = new SparqlEndpoint(ENDPOINT_URL);

document.addEventListener("DOMContentLoaded", () => {
  if (!NAME) return;
  if (isTrustedEndpoint(ENDPOINT_URL)) main(NAME);
  else confirmEndpoint(NAME);
});

// an endpoint chosen in the settings menu applies right away
document.addEventListener("endpoint-change", useStoredEndpoint);

/**
 * Drops the `server` parameter from the address, so that the stored endpoint
 * is used, and loads the page again if a name is searched.
 */
function useStoredEndpoint() {
  const target = new URL(document.location.href);
  target.searchParams.delete("server");
  if (!NAME) {
    history.replaceState(null, "", target);
    return;
  }
  target.hash = "";
  const current = new URL(document.location.href);
  current.hash = "";
  if (target.href === current.href) document.location.reload();
  else document.location.href = target.href;
}

/**
 * A link may name any endpoint in its `server` parameter. Before showing
 * results from an endpoint that is neither a known one nor the one chosen in
 * the settings, the user is asked to confirm it.
 */
function confirmEndpoint(name: string) {
  const root = document.getElementById("root") as HTMLDivElement;
  const notice = document.createElement("div");
  notice.className = "endpoint-notice";
  root.append(notice);

  const searchAnyway = () => {
    notice.remove();
    main(name);
  };

  render(
    html`
      ${isValidEndpoint(ENDPOINT_URL)
        ? html`
          <p>
                    This link searches the SPARQL endpoint
                    <code class="uri">${ENDPOINT_URL}</code>, which is not one of the
                    known endpoints nor the one chosen in the
                    <a href="settings.html">settings</a>. The results would come from
                    that server.
                  </p>
          <button @click=${searchAnyway}>Search with this endpoint</button>
        `
        : html`<p>
          This link names <code class="uri">${ENDPOINT_URL}</code> as SPARQL
          endpoint, which is not a valid endpoint URL.
        </p>`}
            <button
        @click=${useStoredEndpoint}>Use <code class="uri">${getStoredEndpoint()
          .replace("https://", "")}</code> instead</button>
    `,
    notice,
  );
}

function main(name: string) {
  const root = document.getElementById("root") as HTMLDivElement;

  const synoGroup = new SynonymGroup(
    sparqlEndpoint,
    name,
    HIDE_COL_ONLY_SYNONYMS,
    START_WITH_SUBTAXA,
    NOSYNONYMS,
  );

  const synoMain = new SynoMain();
  synoMain.synoGroup = synoGroup;
  root.append(synoMain);
}
