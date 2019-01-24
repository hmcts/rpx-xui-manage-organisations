import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromFeeAccounts from '../reducers/fee-accounts.reducer';

export const getFeeAccountsState = createSelector(
  fromFeature.getRootFeeAccountsState,
  (state: fromFeature.FeeAccountsState) => state.feeAccounts
);

export const getGetUserArray = createSelector(
  getFeeAccountsState,
  fromFeeAccounts.getFeeAccounts
);


