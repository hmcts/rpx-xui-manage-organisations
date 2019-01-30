import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromSingleFeeAccount from '../reducers/single-fee-account.reducer';

export const getSingleFeeAccountState = createSelector(
  fromFeature.getRootFeeAccountsState,
  (state: fromFeature.FeeAccountsState) => state.singleFeeAccount
);

export const getSingleFeeAccountArray = createSelector(
  getSingleFeeAccountState,
  fromSingleFeeAccount.getSingleFeeAccount
);


