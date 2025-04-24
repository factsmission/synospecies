// @ts-types="yasqe/src/index.d.ts"
import Yasqe from "yasqe";
import "yasqe/build/yasqe.min.css";

// @ts-types="yasr/src/index.ts"
import Yasr from "yasr";
import "yasr/build/yasr.min.css";

import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import "./components/Icons.ts";

const queryPrefixes = {
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  dwcFP: "http://filteredpush.org/ontologies/oa/dwcFP#",
  dwc: "http://rs.tdwg.org/dwc/terms/",
  dc: "http://purl.org/dc/elements/1.1/",
  trt: "http://plazi.org/vocab/treatment#",
  treatment: "http://treatment.plazi.org/id/",
  taxonConcept: "http://taxon-concept.plazi.org/id/",
  taxonName: "http://taxon-name.plazi.org/id/",
  publication: "http://publication.plazi.org/id/",
};

const resultsPrefixes = {
  bibo: "http://purl.org/ontology/bibo/",
  doi: "http://dx.doi.org/",
  fabio: "http://purl.org/spar/fabio/",
};

const requestConfig = {
  showQueryButton: true,
  method: "GET",
  // headers: () => {
  //   return {};
  // },
};

const config = {
  autofocus: false,
  copyEndpointOnNewTab: true,
  createShareableLink: false,
  autoAddOnInit: true,
  prefixes: { ...queryPrefixes, ...resultsPrefixes },
  plugins: {
    table: {
      dynamicConfig: {
        compact: true,
      },
    },
  },
  // default query
  value: `
# This query gets ten arbitrary triples from the endpoint.
SELECT *
WHERE {
  ?sub ?pred ?obj .
}
LIMIT 10`,
  // render all lines
  editorHeight: "auto",
  viewportMargin: Infinity,
};

@customElement("query-editor")
export class QueryEditor extends LitElement {
  static override styles = css`
  :host {
    color-scheme: only light;
    display: block;
    margin: 1rem 0 2rem;
    background: #ffffff;
    color: #222222;
  }

  .CodeMirror {
    height: auto;
  }

  .yasr {
    .yasr_btnGroup .yasr_btn {
      padding-top: 0;
    }

    .yasr_btn.yasr_external_ref_btn {
      display: none;
    }
  }

  // colum-resizer
  .grip-resizable{table-layout:fixed;} .grip-resizable > tbody > tr > td, .grip-resizable > tbody > tr > th{overflow:hidden}
  .grip-padding > tbody > tr > td, .grip-padding > tbody > tr > th{padding-left:0!important; padding-right:0!important;}
  .grip-container{ height:0px; position:relative;} .grip-handle{margin-left:-5px; position:absolute; z-index:5; }
  .grip-handle .grip-resizable{position:absolute;background-color:red;filter:alpha(opacity=1);opacity:0;width:10px;height:100%;cursor: col-resize;top:0px}
  .grip-lastgrip{position:absolute; width:1px; } .grip-drag{ border-left:1px dotted black;	}
  .grip-flex{width:auto!important;} .grip-handle.grip-disabledgrip .grip-resizable{cursor:default; display:none;}
  `;

  @property()
  accessor persistenceId: string | false = false;

  @property()
  accessor endpoint: string = "https://treatment.ld.plazi.org/sparql";

  @property()
  accessor query: string | null = null;

  override render() {
    // deno-lint-ignore no-explicit-any
    const newConfig: Record<string, any> = {
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
      yasqe.addPrefixes(queryPrefixes);
      yasqe.collapsePrefixes(true);
    }
    globalThis.requestAnimationFrame(() => {
      yasqe.refresh();
    });

    return html`<link href="advanced.css" rel="stylesheet">${div}`;
  }
}

type exampleQuery = {
  title: string;
  description: string;
  query: string;
};
const exampleQueries: exampleQuery[] = [
  {
    title: "All synonyms",
    description: `
    This query returns all synonyms of 
    <code class="uri taxon">http://taxon-concept.plazi.org/id/Animalia/Tyrannosaurus_rex_Osborn_1905</code>.
    It uses a transitive property path to get the taxa (Taxon-Concepts) 
    augmented or defined by a treatmented that deprecates this taxon or that are
    deprecated by a treatement that defines or deprecates this taxon.
    `,
    query: `SELECT DISTINCT *
WHERE {
  <http://taxon-concept.plazi.org/id/Animalia/Tyrannosaurus_rex_Osborn_1905> ((^trt:deprecates/(trt:augmentsTaxonConcept|trt:definesTaxonConcept))|((^trt:augmentsTaxonConcept|^trt:definesTaxonConcept)/trt:deprecates))* ?tc .
}`,
  },
  {
    title: "Find homonyms",
    description: `Find binomens that exist both as Animalia as well as Plantae`,
    query: `SELECT DISTINCT *
WHERE {
  ?s1 a dwcFP:TaxonName ;
      dwc:kingdom "Plantae" ;
      dwc:genus ?gn ;
      dwc:species ?sp ;
      dwc:rank "species" .
  ?s2 a dwcFP:TaxonName ;
      dwc:kingdom "Animalia" ;
      dwc:genus ?gn ;
      dwc:species ?sp ;
      dwc:rank "species" .
}
LIMIT 100`,
  },
  {
    title: "Find kingdoms",
    description:
      `Find all kingdoms and one sample taxon-name from within each.`,
    query: `SELECT DISTINCT ?k (SAMPLE(?s1) as ?s)
WHERE {
  ?s a dwcFP:TaxonName ;
     dwc:kingdom ?k .
}
GROUP BY ?k`,
  },
  {
    title: "Largest graphs",
    description:
      `This query returns the 10 largest graphs on the SPARQL endpoint.`,
    query: `SELECT DISTINCT ?g (COUNT(?sub) AS ?size)
WHERE {
  GRAPH ?g { ?sub ?pred ?obj . }
}
GROUP BY ?g
ORDER BY DESC(?size)
LIMIT 10`,
  },
  {
    title: "Single graph",
    description: `
    This query returns the triples of a single graph.
    Note that this works only on the plazi endpoint, as this is the only endpoint where each treatment receives its own graph.`,
    query: `CONSTRUCT {
  ?s ?p ?o .
}
WHERE {
  GRAPH <https://treatment.plazi.org/id/8E33E30FFFD9FFCC4AD302B2FFB04209> {
    ?s ?p ?o .
  }
}`,
  },
  {
    title: "Unusual Names",
    description:
      `This query returns genus with contain a character from outside the basic latin A-Z.`,
    query: `SELECT DISTINCT ?graph ?genus WHERE { 
  GRAPH ?graph {
    ?sub dwc:genus ?genus .
    ?sub dwc:species ?species .
    ?sub a dwcFP:TaxonName .
    FILTER regex(?genus, "[^a-zA-Z]")
  }
}
ORDER BY UCASE(?genus)
LIMIT 100`,
  },
  {
    title: "Treatments by genus",
    description: "", // TODO
    query: `SELECT DISTINCT *
WHERE { 
  ?tc dwc:rank ?rank ;
      dwc:phylum ?phylum ;
      dwc:kingdom ?kingdom ;
      dwc:class ?class ;
      dwc:family ?family ;
      dwc:order ?oder ;
      dwc:genus "Lestes" ;
      a dwcFP:TaxonConcept .
  OPTIONAL {
    ?tc trt:hasTaxonName ?tn .
  }
  OPTIONAL {
    ?augmentingTreatment trt:augmentsTaxonConcept ?tc .
    ?augmentingTreatment dc:creator ?augmentingTreatmentCreator .
  }
  OPTIONAL {
    ?definingTreatment trt:definesTaxonConcept ?tc .
    ?definingTreatment dc:creator ?definingTreatmentCreator .
  }
}`,
  },
  {
    title: "List material citations",
    description: "", // TODO
    query: `SELECT ?s WHERE { ?s a dwc:MaterialCitation . } LIMIT 10`,
  },
  {
    title: "List specific material citations",
    description:
      `This query returns all material citations for all synonyms of Tyrannosaurus rex that are in the New Mexico Museum of Natural History & Science (NMMNH).`,
    query: `SELECT DISTINCT ?syn ?catalogNumber # ?collectionCode
WHERE {
  <http://taxon-concept.plazi.org/id/Animalia/Tyrannosaurus_rex_Osborn_1905> ((^trt:deprecates/(trt:augmentsTaxonConcept|trt:definesTaxonConcept))|((^trt:augmentsTaxonConcept|^trt:definesTaxonConcept)/trt:deprecates))* ?syn .
  ?treat (trt:definesTaxonConcept|trt:augmentsTaxonConcept|trt:deprecates) ?syn ;
         dwc:basisOfRecord ?mc .
  # This might miss some specimens where the ‘dwc:collectionCode’ was entered in a non-standard way.
  # Replace ‘"NMMNH"’ with ‘?collectionCode’ to remove this restriction.
  # You may then add ‘?collectionCode’ to the ‘SELECT’ line to see each specimen’s collection.
  ?mc dwc:collectionCode "NMMNH" ;
      dwc:catalogNumber ?catalogNumber .
}`,
  },
];

@customElement("syno-advanced")
export class SynoAdvanced extends LitElement {
  static override styles = css`
  h4 {
    margin-bottom: 0.2rem;
  }
  h4 + p {
    margin-top: 0;
  }

  .options {
    border: 1px solid var(--nav-background);
    display: grid;
    gap: 0.5rem;
    grid-template-columns: auto repeat(4, auto);
    margin: 1rem 0;
    padding: 0.5rem;
  }
  `;

  @state()
  accessor endpoint: string = "https://treatment.ld.plazi.org/sparql";

  override render() {
    const params = new URLSearchParams(document.location.search);
    const ENDPOINT_URL = params.get("server");
    if (ENDPOINT_URL) this.endpoint = ENDPOINT_URL;

    return html`
      <link href="index.css" rel="stylesheet">
      <h2>Advanced Mode</h2>
      <p>
        Here, you can run arbitrary
        <a target="_blank" href="https://www.w3.org/TR/sparql11-query/" class="uri">SPARQL<s-icon icon="link"></s-icon></a>
        queries against our data.
      </p>
      <div class="options">
        <span>Server:</span>
        <label><input type="radio" name="endpoint" checked=${
      this.endpoint === "https://qlever.ld.plazi.org/sparql"
    } @change=${() => {
      this.endpoint = "https://qlever.ld.plazi.org/sparql";
    }}>Qlever <code class="uri">qlever.ld.plazi.org/sparql</code> (NEW)</label>
        <label><input type="radio" name="endpoint" checked=${
      this.endpoint === "https://lindas-cached.cluster.ldbar.ch/query"
    } @change=${() => {
      this.endpoint = "https://lindas-cached.cluster.ldbar.ch/query";
    }}>Lindas <code class="uri">lindas-cached.cluster.ldbar.ch/query</code></label>
        <label><input type="radio" name="endpoint" checked=${
      this.endpoint === "https://lindas.admin.ch/query"
    } @change=${() => {
      this.endpoint = "https://lindas.admin.ch/query";
    }}>Lindas uncached <code class="uri">lindas.admin.ch/query</code></label>
        <label><input type="radio" name="endpoint" checked=${
      this.endpoint === "https://treatment.ld.plazi.org/sparql"
    } @change=${() => {
      this.endpoint = "https://treatment.ld.plazi.org/sparql";
    }}>Plazi <code class="uri">treatment.ld.plazi.org/sparql</code> (Most up-to-date)</label>
      </div>
      <query-editor persistenceId="editor-1" endpoint=${this.endpoint}></query-editor>
      <query-editor persistenceId="editor-2" endpoint=${this.endpoint}></query-editor>
      <hr>
      <h3>Example Queries</h3>
      <p><small>(You can reset the following editors by reloading the page)</small></p>
      ${
      exampleQueries.map((example) =>
        html`<section>
          <h4>${example.title}</h4>
          <p>${unsafeHTML(example.description)}</p>
          <query-editor query=${example.query} endpoint=${this.endpoint}></query-editor>
        </section>`
      )
    }
    `;
  }
  // protected override createRenderRoot() {
  //   return this;
  // }
}

const endpoints = {
  plazi: "https://treatment.ld.plazi.org/sparql",
  lindas: "https://lindas.admin.ch/query",
  cached: "https://lindas-cached.cluster.ldbar.ch/query",
  qlever: "https://qlever.ld.plazi.org/sparql",
};
