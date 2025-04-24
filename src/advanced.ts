// @ts-types="yasqe/src/index.d.ts"
import Yasqe from "yasqe";
import "yasqe/build/yasqe.min.css";

// @ts-types="yasr/src/index.ts"
import Yasr from "yasr";
import "yasr/build/yasr.min.css";
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

const params = new URLSearchParams(document.location.search);
const ENDPOINT_URL = params.get("server") ||
  "https://lindas-cached.cluster.ldbar.ch/query"; // "https://treatment.ld.plazi.org/sparql";

const queryPrefixes = {
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  dwcFP: "http://filteredpush.org/ontologies/oa/dwcFP#",
  trt: "http://plazi.org/vocab/treatment#",
  treatment: "http://treatment.plazi.org/id/",
  taxonConcept: "http://taxon-concept.plazi.org/id/",
  taxonName: "http://taxon-name.plazi.org/id/",
  publication: "http://publication.plazi.org/id/",
};

const resultsPrefixes = {
  bibo: "http://purl.org/ontology/bibo/",
  dwc: "http://rs.tdwg.org/dwc/terms/",
  dce: "http://purl.org/dc/elements/1.1/",
  doi: "http://dx.doi.org/",
  fabio: "http://purl.org/spar/fabio/",
};

const requestConfig = {
  showQueryButton: true,
  endpoint: ENDPOINT_URL,
  method: "GET",
  headers: () => {
    return {};
  },
};

const config = {
  autofocus: true,
  copyEndpointOnNewTab: true,
  autoAddOnInit: true,
  prefixes: { ...queryPrefixes, ...resultsPrefixes },
  yasr: {
    pluginOrder: ["table", "response"],
  },
  // default query
  value: `
# This query gets ten arbitrary triples from the endpoint.
SELECT *
WHERE {
  ?sub ?pred ?obj .
}
LIMIT 10`,
};

@customElement("query-editor")
export class QueryEditor extends LitElement {
  static override styles = css`
  :host {
    display: block;
    margin: 1rem 0;
  }
  `;

  @property()
  accessor persistenceId: string | undefined = undefined;

  @property()
  accessor endpoint: string = "https://treatment.ld.plazi.org/sparql";

  @property()
  accessor query: string | null = null;

  override render() {
    const newConfig = {
      ...config,
      requestConfig: {
        ...requestConfig,
        endpoint: this.endpoint,
      },
      persistenceId: this.persistenceId,
    };
    const div = document.createElement("div");
    const yasqe = new Yasqe(div, newConfig);
    yasqe.addPrefixes(queryPrefixes);
    yasqe.collapsePrefixes(true);
    const yasr = new Yasr(div, newConfig);
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

    if (this.query !== null) {
      yasqe.setValue(this.query);
    }
    window.requestAnimationFrame(() => {
      yasqe.refresh();
    });

    return html`<link href="advanced.css" rel="stylesheet">${div}`;
  }
}

@customElement("syno-advanced")
export class SynoAdvanced extends LitElement {
  override render() {
    return html`
      <h2>Advanced Mode</h2>
      <p>
        Here, you can run arbitrary <a href="https://www.w3.org/TR/sparql11-query/">SPARQL</a> queries against our data.
      </p>
      <query-editor persistenceId="editor-1"></query-editor>
      <query-editor persistenceId="editor-2"></query-editor>
    `;
  }
  protected override createRenderRoot() {
    return this;
  }
}
