import { createSelector } from '@ngrx/store';
import { AppUtils } from '../../../app/utils/app-utils';
import * as fromFeature from '../reducers';

export const getUnassignedCasesState = createSelector(
    fromFeature.getRootUnassignedCases,
    (state: fromFeature.UnassignedCasesState) => state.unassignedCases
  );

export const getAllUnassignedCases = createSelector(
  getUnassignedCasesState,
  unassignedCasesState => unassignedCasesState.unassignedCases
);

export const getAllUnassignedCaseTypes = createSelector(
  getUnassignedCasesState,
  unassignedCasesState => unassignedCasesState.caseTypes
);

export const getSelectedCases = createSelector(
  getUnassignedCasesState,
  unassignedCasesState => unassignedCasesState.selectedCases
);

export const anySelectedCases = createSelector(
  getSelectedCases,
  selectedCases => AppUtils.atleastOneCase(selectedCases)
);

