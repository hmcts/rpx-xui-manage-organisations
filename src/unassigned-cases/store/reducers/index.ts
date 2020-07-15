import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromUnassingedCases from './unassigned-cases.reducer';

export interface UnassignedCaseState {
    unassignedCases: fromUnassingedCases.UnassignedCasesState;
}

export const reducers: ActionReducerMap<UnassignedCaseState> = {
    unassignedCases: fromUnassingedCases.reducer
  };

export const getRootUnassingedCases = createFeatureSelector<fromUnassingedCases.UnassignedCasesState>(
    'unassignedCases'
  );
