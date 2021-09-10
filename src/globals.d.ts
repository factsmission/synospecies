import type { SynonymGroup as syg } from '@factsmission/synogroup'
declare global {
  interface Window {
    SynonymGroup: syg;
  }
}