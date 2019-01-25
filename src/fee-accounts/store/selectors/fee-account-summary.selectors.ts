import { createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromFeeAccountSummary from '../reducers/fee-account-summary.reducer';

export const getFeeAccountSummaryState = createSelector(
  fromFeature.getRootFeeAccountsState,
  (state: fromFeature.FeeAccountsState) => state.feeAccountSummary
);

export const getFeeAccountSummaryArray = createSelector(
  getFeeAccountSummaryState,
  fromFeeAccountSummary.getFeeAccountSummary
);


