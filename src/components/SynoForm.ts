import type { SparqlEndpoint } from "@plazi/synolib";
import Taxomplete from "taxomplete";

const endpoints = {
  plazi: "https://treatment.ld.plazi.org/sparql",
  lindas: "https://lindas.admin.ch/query",
  cached: "https://lindas-cached.cluster.ldbar.ch/query",
};

export class SynoForm extends HTMLElement {
  constructor(private sparqlEndpoint: SparqlEndpoint) {
    super();
  }

  connectedCallback() {
    if (this.innerHTML) return;

    const params = new URLSearchParams(document.location.search);
    const SHOW_COL = params.has("show_col");
    const START_WITH_SUBTAXA = params.has("subtaxa");
    const SORT_TREATMENTS_BY_TYPE = params.has("sort_treatments_by_type");
    const ENDPOINT_URL = params.get("server");
    const NAME = params.get("q");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    if (NAME) nameInput.value = NAME;

    const colCheckLabel = document.createElement("label");
    colCheckLabel.innerText = "Show CoL-synonyms.";
    const colCheck = document.createElement("input");
    colCheck.type = "checkbox";
    colCheck.checked = NAME ? SHOW_COL : true;
    colCheckLabel.prepend(colCheck);

    const subtaxaCheckLabel = document.createElement("label");
    subtaxaCheckLabel.innerText = "Include subatxa of search term.";
    const subtaxaCheck = document.createElement("input");
    subtaxaCheck.type = "checkbox";
    subtaxaCheck.checked = NAME ? START_WITH_SUBTAXA : true;
    subtaxaCheckLabel.prepend(subtaxaCheck);

    const sorttreatmentsCheckLabel = document.createElement("label");
    sorttreatmentsCheckLabel.innerText = "Sort treatments by type.";
    const sorttreatmentsCheck = document.createElement("input");
    sorttreatmentsCheck.type = "checkbox";
    sorttreatmentsCheck.checked = NAME ? SORT_TREATMENTS_BY_TYPE : true;
    sorttreatmentsCheckLabel.prepend(sorttreatmentsCheck);

    const endpointPlaziLabel = document.createElement("label");
    const endpointPlaziLabelUrl = document.createElement("code");
    endpointPlaziLabelUrl.className = "uri";
    endpointPlaziLabelUrl.innerText = endpoints.plazi;
    const endpointPlazi = document.createElement("input");
    endpointPlazi.type = "radio";
    endpointPlazi.name = "endpoint";
    endpointPlazi.checked = ENDPOINT_URL === endpoints.plazi;
    endpointPlaziLabel.append(
      endpointPlazi,
      "Plazi ",
      endpointPlaziLabelUrl,
      " (Most up-to-date)",
    );

    const endpointLindasCachedLabel = document.createElement("label");
    const endpointLindasCachedLabelUrl = document.createElement("code");
    endpointLindasCachedLabelUrl.className = "uri";
    endpointLindasCachedLabelUrl.innerText = endpoints.cached;
    const endpointLindasCached = document.createElement("input");
    endpointLindasCached.type = "radio";
    endpointLindasCached.name = "endpoint";
    endpointLindasCached.checked = ENDPOINT_URL
      ? ENDPOINT_URL === endpoints.cached
      : true;
    endpointLindasCachedLabel.append(
      endpointLindasCached,
      "Lindas ",
      endpointLindasCachedLabelUrl,
      " (Default)",
    );

    const endpointLindasLabel = document.createElement("label");
    const endpointLindasLabelUrl = document.createElement("code");
    endpointLindasLabelUrl.className = "uri";
    endpointLindasLabelUrl.innerText = endpoints.lindas;
    const endpointLindas = document.createElement("input");
    endpointLindas.type = "radio";
    endpointLindas.name = "endpoint";
    endpointLindas.checked = ENDPOINT_URL === endpoints.lindas;
    endpointLindasLabel.append(
      endpointLindas,
      "Lindas uncached ",
      endpointLindasLabelUrl,
    );

    const button = document.createElement("button");
    button.innerText = "Go";

    const search = document.createElement("div");
    search.className = "search";
    search.append(nameInput, button);

    const options = document.createElement("div");
    options.className = "options";
    options.append(
      "Options: ",
      colCheckLabel,
      subtaxaCheckLabel,
      sorttreatmentsCheckLabel,
      "Server: ",
      endpointLindasCachedLabel,
      endpointLindasLabel,
      endpointPlaziLabel,
    );

    this.append(search, options);

    const go = () => {
      const params = new URLSearchParams({
        q: nameInput.value,
      });
      if (colCheck.checked) params.append("show_col", "");
      if (subtaxaCheck.checked) params.append("subtaxa", "");
      if (sorttreatmentsCheck.checked) {
        params.append("sort_treatments_by_type", "");
      }
      if (endpointLindasCached.checked) {
        params.append("server", endpoints.cached);
      } else if (endpointLindas.checked) {
        params.append("server", endpoints.lindas);
      } else if (endpointPlazi.checked) {
        params.append("server", endpoints.plazi);
      }
      document.location.hash = "";
      document.location.search = params.toString();
    };

    button.addEventListener("click", go);
    nameInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") go();
    });

    // we can only create the Taxomplete when nameInput has a parent
    new Taxomplete(nameInput, this.sparqlEndpoint).action = go;
  }
}

customElements.define("syno-form", SynoForm);
