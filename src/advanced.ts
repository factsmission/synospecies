// @ts-types="yasqe/src/index.d.ts"
import Yasqe from "yasqe";
import "yasqe/build/yasqe.min.css";

// @ts-types="yasr/src/index.ts"
import Yasr from "yasr";
import "yasr/build/yasr.min.css";

const params = new URLSearchParams(document.location.search);
const ENDPOINT_URL = params.get("server") ||
  "https://lindas-cached.cluster.ldbar.ch/query"; // "https://treatment.ld.plazi.org/sparql";

const queryPrefixes = {
  dwcFP: "http://filteredpush.org/ontologies/oa/dwcFP#",
  trt: "http://plazi.org/vocab/treatment#",
  treatment: "http://treatment.plazi.org/id/",
  taxonConcept: "http://taxon-concept.plazi.org/id/",
  taxonName: "http://taxon-name.plazi.org/id/",
  publication: "http://publication.plazi.org/id/",
};

const resultsPrefixes = {
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  bibo: "http://purl.org/ontology/bibo/",
  dwc: "http://rs.tdwg.org/dwc/terms/",
  dce: "http://purl.org/dc/elements/1.1/",
  doi: "http://dx.doi.org/",
  fabio: "http://purl.org/spar/fabio/",
};

const config = {
  autofocus: true,
  copyEndpointOnNewTab: true,
  autoAddOnInit: true,
  requestConfig: {
    showQueryButton: true,
    endpoint: ENDPOINT_URL,
    method: "GET",
    headers: () => {
      return {};
    },
  },
  prefixes: { ...queryPrefixes, ...resultsPrefixes },
  yasr: {
    pluginOrder: ["table", "response"],
  },
};

export class QueryEditor extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // const _y = new Yasgui(this.rootnode, config);
    const yasqe = new Yasqe(this, config);
    yasqe.addPrefixes(queryPrefixes);
    yasqe.collapsePrefixes(true);
    const yasr = new Yasr(this, config);
    yasqe.on(
      "queryResponse",
      (
        _instance: Yasqe,
        req: unknown,
        duration: number,
      ) => {
        yasr.setResponse(req, duration);
      },
    );
  }
}
customElements.define("syno-advanced", QueryEditor);

// @customElement("syno-advanced")
// export class Icon extends LitElement {
//   readonly rootnode = document.createElement("div");

//   override render() {
//     // const _y = new Yasgui(this.rootnode, config);
//     const _yasqe = new Yasqe(this.rootnode, {
//       requestConfig: {
//         showQueryButton: true,
//         persistenceId: null,
//         endpoint: "https://treatment.ld.plazi.org/sparql",
//         method: "GET",
//       },
//     });
//     return html`<link href="advanced.css" rel="stylesheet">${this.rootnode}`;
//   }
// }
