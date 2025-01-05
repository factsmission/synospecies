/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "taxomplete" {
  export default class Taxomplete {
    constructor(
      element: HTMLInputElement,
      endpoint:
        any, /* This should be `SparqlEndpoint` but that creates a loop */
    );
    [key: string]: any;
  }
}
