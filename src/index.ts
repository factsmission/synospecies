import { SparqlEndpoint, SynonymGroup } from "@plazi/synolib";

import "./components/SynoForm.ts";
import { SynoMain } from "./components/SynoMain.ts";

const params = new URLSearchParams(document.location.search);
const HIDE_COL_ONLY_SYNONYMS = !params.has("show_col");
const START_WITH_SUBTAXA = params.has("subtaxa");
const ENDPOINT_URL = params.get("server") ||
  "https://lindas-cached.cluster.ldbar.ch/query"; // "https://treatment.ld.plazi.org/sparql";
const NAME = params.get("q");
const NOSYNONYMS = params.has("nosynonyms");

const sparqlEndpoint = new SparqlEndpoint(ENDPOINT_URL);

document.addEventListener("DOMContentLoaded", () => {
  if (NAME) main(NAME);
});

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
