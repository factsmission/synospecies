import type syg, { SparqlEndpoint } from '@factsmission/synogroup'

declare global {
  interface Window {
    SynonymGroup: typeof syg;
    SparqlEndpoint: typeof SparqlEndpoint;
  }
}