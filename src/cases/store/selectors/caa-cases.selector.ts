import { createSelector } from '@ngrx/store';
import { AppUtils } from '../../../app/utils/app-utils';
import * as fromFeature from '../reducers';

export const getCaaCasesState = createSelector(
  fromFeature.getRootCaaCases,
  (state: fromFeature.CaaCasesState) => state.caaCases
);

export const getAllCases = createSelector(
  getCaaCasesState,
  (caaCases) => caaCases.Cases
);

export const getAllCasesError = createSelector(
  getCaaCasesState,
  fromFeature.getCasesError
);

export const getCaseDataWithSupplementary = createSelector(
  getCaaCasesState,
  (caaCases) => caaCases ? caaCases.casesWithSupplementary : null
);

export const getAllCaseData = createSelector(
  getAllCases,
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
