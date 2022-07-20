import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromCaseShare from './share-case.reducer';
import * as fromCaaCases from './caa-cases.reducer';

export interface CaaCasesState {
  caaCases: fromCaaCases.CaaCasesState;
  caseShare: fromCaseShare.ShareCasesState;
}

export const reducers: ActionReducerMap<CaaCasesState> = {
  caaCases: fromCaaCases.caaCasesReducer,
  caseShare: fromCaseShare.shareCasesReducer
};

export const getRootCaaCases = createFeatureSelector<CaaCasesState>(
  'caaCases'
);

export * from './caa-cases.reducer';
export * from './share-case.reducer';
