import type syg from '@factsmission/synogroup'
declare global {
  interface Window {
    SynonymGroup: typeof syg;
  }
}