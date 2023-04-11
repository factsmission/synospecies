/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'ext-rdflib' {
  function sym(url: string): any
}

declare module '@retog/sparql-client' {
  export default class SparqlEndpoint {
    constructor (url: string);
    [key: string]: any
  }
}

declare module '@/TaxaManager' {
  export default class TaxaManager {
    constructor (endpoint: any /* This should be `SparqlEndpoint` but that creates a loop */);
    [key: string]: (..._: any) => any
  }
}

declare module '@/VernacularViewer' {
  export default class VernacularViewer {
    constructor (el: HTMLElement);
    [key: string]: any
  }
}

declare module '@/WikidataViewer' {
  export default class WikidataViewer {
    constructor (el: HTMLElement);
    [key: string]: any
  }
}