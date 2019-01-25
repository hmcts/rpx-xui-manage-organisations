import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromFeeAccounts from './fee-accounts.reducer';
import * as fromFeeAccountSummary from './fee-account-summary.reducer';


export interface FeeAccountsState {
  feeAccounts: fromFeeAccounts.FeeAccountsState;
  feeAccountSummary: fromFeeAccountSummary.FeeAccountSummaryState;
}

export const reducers: ActionReducerMap<FeeAccountsState> = {
  feeAccounts: fromFeeAccounts.reducer,
  feeAccountSummary: fromFeeAccountSummary.reducer,
};

export const getRootFeeAccountsState = createFeatureSelector<FeeAccountsState>(
  'feeAccounts'
);
