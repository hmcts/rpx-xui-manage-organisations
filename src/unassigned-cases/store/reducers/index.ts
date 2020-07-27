import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromUnassignedCases from './unassigned-cases.reducer';

export interface UnassignedCasesState {
    unassignedCases: fromUnassignedCases.UnassignedCasesState;
}

export const reducers: ActionReducerMap<UnassignedCasesState> = {
    unassignedCases: fromUnassignedCases.reducer
  };

export const getRootUnassignedCases = createFeatureSelector<UnassignedCasesState>(
    'unassignedCases'
  );
