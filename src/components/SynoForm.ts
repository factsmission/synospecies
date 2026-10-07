import Awesomplete from "awesomplete";
import Taxomplete from "taxomplete";

import { getEndpoint } from "../endpoints.ts";
import "./EndpointSelect.ts";

export class SynoForm extends HTMLElement {
  connectedCallback() {
    if (this.innerHTML) return;

    const params = new URLSearchParams(document.location.search);
    const SHOW_COL = params.has("show_col");
    const START_WITH_SUBTAXA = params.has("subtaxa");
    const NOSYNONYMS = params.has("nosynonyms");
    const NAME = params.get("q");
    const ENDPOINT_URL = getEndpoint();

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
    subtaxaCheck.checked = NAME ? START_WITH_SUBTAXA : false;
    subtaxaCheckLabel.prepend(subtaxaCheck);

    const nosynonymsCheckLabel = document.createElement("label");
    nosynonymsCheckLabel.innerText = "Do not search for Synonyms";
    const nosynonymsCheck = document.createElement("input");
    nosynonymsCheck.type = "checkbox";
    nosynonymsCheck.checked = NAME ? NOSYNONYMS : false;
    nosynonymsCheckLabel.prepend(nosynonymsCheck);

    colCheck.disabled = nosynonymsCheck.checked;
    nosynonymsCheck.addEventListener(
      "change",
      () => colCheck.disabled = nosynonymsCheck.checked,
    );

    const endpointSelect = document.createElement("endpoint-select");
    endpointSelect.value = ENDPOINT_URL;

    const button = document.createElement("button");
    button.innerText = "Go";

    const search = document.createElement("div");
    search.className = "search";
    search.append(nameInput, button);

    const label = document.createElement("span");
    label.innerText = "(Options applied on next search)";
    // label.style.gridColumn = "auto / span 2";

    const options = document.createElement("div");
    options.className = "options";
    options.append(
      "Options: ",
      colCheckLabel,
      subtaxaCheckLabel,
      nosynonymsCheckLabel,
      label,
      "Server: ",
      endpointSelect,
    );

    this.append(search, options);

    const go = () => {
      if (!endpointSelect.checkValidity()) return;
      const params = new URLSearchParams({
        q: nameInput.value,
      });
      if (colCheck.checked) params.append("show_col", "");
      if (subtaxaCheck.checked) params.append("subtaxa", "");
      if (nosynonymsCheck.checked) params.append("nosynonyms", "");
      // if (sorttreatmentsCheck.checked) {
      //   params.append("sort_treatments_by_type", "");
      // }
      params.append("server", endpointSelect.value);
      document.location.hash = "";
      document.location.search = params.toString();
    };

    button.addEventListener("click", go);
    nameInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") go();
    });

    // we can only create the Taxomplete when nameInput has a parent
    new Taxomplete(nameInput, ENDPOINT_URL).action = go;
    // Taxomplete renders the suggestions, which come from the endpoint, as
    // HTML; render them as text instead.
    const awesomplete = Awesomplete.all.find((a: { input: HTMLElement }) =>
      a.input === nameInput
    );
    if (awesomplete) awesomplete.item = suggestionItem;
  }
}

/** Like Taxomplete's suggestion item, but without parsing it as HTML. */
function suggestionItem(suggestion: string, input: string): HTMLLIElement {
  const text = String(suggestion);
  const spacePos = text.slice(0, -1).indexOf(" ");
  // the input matches either the start or the second word of the suggestion
  const start = spacePos !== -1 && !input.includes(" ") ? spacePos + 1 : 0;
  const end = start + input.length;
  const mark = document.createElement("mark");
  mark.textContent = text.slice(start, end);
  const li = document.createElement("li");
  li.setAttribute("aria-selected", "false");
  li.append(text.slice(0, start), mark, text.slice(end));
  return li;
}

customElements.define("syno-form", SynoForm);
