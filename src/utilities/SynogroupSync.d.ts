import type { JustifiedSynonym, Treatment } from '@factsmission/synogroup'

export declare type SyncTreatment = Omit<Treatement, "materialCitations"> & {
  materialCitations: MaterialCitation[]
}

export declare type SyncTreatments = {
  def: SyncTreatment[];
  aug: SyncTreatment[];
  dpr: SyncTreatment[];
};

export declare type anySyncJustification = {
  toString: () => string;
  precedingSynonym?: JustifiedSynonym;
  treatment?: Treatment;
};

export declare type SyncJustifiedSynonym = {
  taxonConceptUri: string;
  taxonNameUri: string;
  justifications: anySyncJustification[];
  treatments: SyncTreatments;
  loading: boolean;
};