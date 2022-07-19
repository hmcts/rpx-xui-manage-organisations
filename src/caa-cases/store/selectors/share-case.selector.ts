import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';

export const getCaseShareState = createSelector(
  fromFeature.getRootCaaCases,
  (state: fromFeature.CaaCasesState) => state.caseShare
);

export const getShareCaseListState = createSelector(
  getCaseShareState,
  fromFeature.getShareCases
);

export const getOrganisationUsersState = createSelector(
  getCaseShareState,
  fromFeature.getOrganisationUsers
);
