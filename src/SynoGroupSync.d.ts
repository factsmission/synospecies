import type { JustifiedSynonym, Treatment } from '@factsmission/synogroup'

export declare type SyncTreatments = {
  def: Treatment[];
  aug: Treatment[];
  dpr: Treatment[];
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