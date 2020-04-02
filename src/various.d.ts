declare module 'ext-rdflib' {
  function sym(url: string): any
}

declare module '@/TaxaManager' {
  export default class TaxaManager {
    [key: string]: (..._: any) => any
  }
}