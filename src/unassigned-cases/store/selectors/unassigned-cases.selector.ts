import { createSelector } from '@ngrx/store';
import * as fromFeature from '../reducers';

export const getUnassignedCasesState = createSelector(
    fromFeature.getRootUnassignedCases,
    (state: fromFeature.UnassignedCasesState) => state.unassignedCases
  );

  export const getAllUnassignedCases = createSelector(
    getUnassignedCasesState,
    unassignedCasesState => unassignedCasesState.unassignedCases
  );

