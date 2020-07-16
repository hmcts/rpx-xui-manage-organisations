import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromUnassingedCases from './unassigned-cases.reducer';

export interface UnassignedCasesState {
    unassignedCases: fromUnassingedCases.UnassignedCasesState;
}

export const reducers: ActionReducerMap<UnassignedCasesState> = {
    unassignedCases: fromUnassingedCases.reducer
  };

export const getRootUnassingedCases = createFeatureSelector<UnassignedCasesState>(
    'unassignedCases'
  );
