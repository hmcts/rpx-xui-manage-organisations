import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromCaseShare from './share-case.reducer';
import * as fromUnassingedCases from './unassigned-cases.reducer';

export interface UnassignedCasesState {
    unassignedCases: fromUnassingedCases.UnassignedCasesState;
    caseShare: fromCaseShare.ShareCasesState;
}

export const reducers: ActionReducerMap<UnassignedCasesState> = {
    unassignedCases: fromUnassingedCases.reducer,
    caseShare: fromCaseShare.shareCasesReducer
  };

export const getRootUnassingedCases = createFeatureSelector<UnassignedCasesState>(
    'unassignedCases'
  );

export * from './unassigned-cases.reducer';
export * from './share-case.reducer';
