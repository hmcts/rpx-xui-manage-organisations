import { createSelector } from '@ngrx/store';
import { AppUtils } from '../../../app/utils/app-utils';
import * as fromFeature from '../reducers';

export const getCaaCasesState = createSelector(
  fromFeature.getRootCaaCases,
  (state: fromFeature.CaaCasesState) => state.caaCases
);

export const getAllAssignedCases = createSelector(
  getCaaCasesState,
  (caaCases) => caaCases.assignedCases
);

export const getAllAssignedCasesError = createSelector(
  getCaaCasesState,
  fromFeature.getAssignedCasesError
);

export const getAllAssignedCaseData = createSelector(
  getAllAssignedCases,
  (caaCases) => caaCases ? caaCases.data : null
);

export const getAllUnassignedCases = createSelector(
  getCaaCasesState,
  (caaCases) => caaCases.unassignedCases
);

export const getAllUnassignedCasesError = createSelector(
  getCaaCasesState,
  fromFeature.getUnassignedCasesError
);

export const getAllUnassignedCaseData = createSelector(
  getAllUnassignedCases,
  (caaCases) => caaCases ? caaCases.data : null
);

export const getAllCaseTypes = createSelector(
  getCaaCasesState,
  (caaCases) => caaCases.caseTypes
);

export const getSelectedCases = createSelector(
  getCaaCasesState,
  (caaCases) => caaCases.selectedCases
);

export const anySelectedCases = createSelector(
  getSelectedCases,
  (selectedCases) => AppUtils.atLeastOneCase(selectedCases)
);

export const getSelectedCasesList = createSelector(
  getSelectedCases,
  (selectedCases) => AppUtils.getSelectedItemsList(selectedCases)
);
