import { createSelector } from '@ngrx/store';
import * as fromFeature from '../../store/reducers';

export const getUnassignedCasesState = createSelector(
    fromFeature.getRootUnassingedCases,
    (state: fromFeature.UnassignedCasesState) => state.unassignedCases
  );

export const getUnassignedCases = createSelector(
    getUnassignedCasesState,
    unassignedCasesState => unassignedCasesState.unassignedCases
  );

