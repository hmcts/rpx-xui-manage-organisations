import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';

export const getCaseShareState = createSelector(
  fromFeature.getRootCaaCases,
  (state: fromFeature.CaaCasesState) => state?.caseShare
);

export const getShareAssignedCaseListState = createSelector(
  getCaseShareState,
  fromFeature.getShareAssignedCases
);

export const getShareUnassignedCaseListState = createSelector(
  getCaseShareState,
  fromFeature.getShareUnassignedCases
);

export const getOrganisationUsersState = createSelector(
  getCaseShareState,
  fromFeature.getOrganisationUsers
);
