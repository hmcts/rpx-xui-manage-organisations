import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromSingleFeeAccount from '../reducers/single-fee-account.reducer';

export const getSingleFeeAccountState = createSelector(
  fromFeature.getRootFeeAccountsState,
  (state: fromFeature.FeeAccountsState) => state.singleFeeAccount
);

export const getSingleAccounOverview = createSelector(
  getSingleFeeAccountState,
  fromSingleFeeAccount.getSingleFeeAccountOverview
);

export const pbaAccountSummaryLoading = createSelector(getSingleFeeAccountState, fromSingleFeeAccount.getSingleFeeAccountOverviewLoading);
export const pbaAccountSummaryLoaded = createSelector(getSingleFeeAccountState, fromSingleFeeAccount.getSingleFeeAccountOverviewLoaded);

export const pbaAccounTransactions = createSelector(getSingleFeeAccountState, fromSingleFeeAccount.getSingleFeeAccountTransactions);





// export const getSingleAccountSummar = createSelector(
//   fromSingleFeeAccount.getSingleFeeAccount, (data) => {
//     console.log('data', data)
//     return {
//       credit_limit: data.credit_limit ? data.credit_limit : '',
//       available_balance: data.available_balance ? data.available_balance: ''
//     };
//   }
// )


