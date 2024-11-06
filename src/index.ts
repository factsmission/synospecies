import { SparqlEndpoint, SynonymGroup } from "@plazi/synolib";

import "./components/SynoForm.ts";
import { SynoName } from "./components/SynoName.ts";

const params = new URLSearchParams(document.location.search);
const HIDE_COL_ONLY_SYNONYMS = !params.has("show_col");
const START_WITH_SUBTAXA = params.has("subtaxa");
const SORT_TREATMENTS_BY_TYPE = params.has("sort_treatments_by_type");
const ENDPOINT_URL = params.get("server") ||
  "https://lindas-cached.cluster.ldbar.ch/query"; // "https://treatment.ld.plazi.org/sparql";
const NAME = params.get("q");

const sparqlEndpoint = new SparqlEndpoint(ENDPOINT_URL);

document.addEventListener("DOMContentLoaded", () => {
  if (NAME) main(NAME);
});

async function main(name: string) {
  const root = document.getElementById("root") as HTMLDivElement;

  const indicator = document.createElement("div");
  root.insertAdjacentElement("beforebegin", indicator);
  indicator.append(`Finding Synonyms for ${NAME} `);
  const progress = document.createElement("progress");
  indicator.append(progress);

  const timeStart = performance.now();

  const synoGroup = new SynonymGroup(
    sparqlEndpoint,
    name,
    HIDE_COL_ONLY_SYNONYMS,
    START_WITH_SUBTAXA,
  );

  for await (const name of synoGroup) {
    const element = new SynoName(name, synoGroup, SORT_TREATMENTS_BY_TYPE);
    root.append(element);
  }
  const timeEnd = performance.now();

  indicator.innerHTML = "";
  indicator.innerText =
    `Found ${synoGroup.names.length} names with ${synoGroup.treatments.size} treatments. This took ${
      (timeEnd - timeStart) / 1000
    } seconds.`;
  if (synoGroup.names.length === 0) root.append(":[");
}
