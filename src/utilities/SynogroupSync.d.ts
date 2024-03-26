import type { JustifiedSynonym, Treatment, TreatmentDetails, anyJustification } from '@factsmission/synogroup'

export declare type SyncTreatment = Omit<Treatment, "details"> & {
  details: TreatmentDetails;
}

export declare type SyncTreatments = {
  def: SyncTreatment[];
  aug: SyncTreatment[];
  dpr: SyncTreatment[];
  cite: SyncTreatment[];
};

export declare type anySyncJustification = {
  toString: () => string;
  precedingSynonym?: JustifiedSynonym;
  treatment?: SyncTreatment;
};

export declare type SyncJustifiedSynonym = Omit<Omit<JustifiedSynonym, "treatments">,"justifications"> & {
  treatments: SyncTreatments;
  justifications: anyJustification[];
};