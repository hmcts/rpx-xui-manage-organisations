import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';

export const getCaseShareState = createSelector(
  fromFeature.getRootCaaCases,
  (state: fromFeature.CaaCasesState) => state?.caseShare ?? fromFeature.initialSharedCasesState
);

export const getShareCaseListState = createSelector(
  getCaseShareState,
  fromFeature.getShareCases
);

export const getOrganisationUsersState = createSelector(
  getCaseShareState,
  fromFeature.getOrganisationUsers
);
