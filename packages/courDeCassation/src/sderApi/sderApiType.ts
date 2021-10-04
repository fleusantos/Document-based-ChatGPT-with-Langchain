import { decisionType } from 'sder';
import { documentType } from '@label/core';
import { labelTreatmentsType } from '@label/backend';

export type { sderApiType };

type sderApiType = {
  fetchChainedJuricaDecisionsToPseudonymiseBetween: (params: {
    startDate: Date;
    endDate: Date;
  }) => Promise<Array<decisionType>>;
  fetchJurinetDecisionsToPseudonymiseBetween: (params: {
    startDate: Date;
    endDate: Date;
  }) => Promise<Array<decisionType>>;
  fetchCourtDecisionBySourceIdAndSourceName: (
    sourceId: decisionType['sourceId'],
    sourceName: decisionType['sourceName'],
  ) => Promise<decisionType | undefined>;
  fetchPublicDecisionsBySourceAndJurisdictionsBetween: (param: {
    startDate: Date;
    endDate: Date;
    source: string;
    jurisdictions: string[];
  }) => Promise<decisionType[]>;
  setCourtDecisionsLoaded: (documents: Array<documentType>) => Promise<void>;
  setCourtDecisionsToBeTreated: (
    documents: Array<documentType>,
  ) => Promise<void>;
  setCourtDecisionDone: (
    externalId: documentType['externalId'],
  ) => Promise<void>;
  updateDecisionPseudonymisation: (param: {
    externalId: documentType['externalId'];
    pseudonymizationText: string;
    labelTreatments: labelTreatmentsType;
  }) => Promise<void>;
};
