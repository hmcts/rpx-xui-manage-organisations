import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromFeeAccounts from './fee-accounts.reducer';
import * as fromSingleFeeAccount from './single-fee-account.reducer';


export interface FeeAccountsState {
  feeAccounts: fromFeeAccounts.FeeAccountsState;
  singleFeeAccount: fromSingleFeeAccount.SingleFeeAccountState;
}

export const reducers: ActionReducerMap<FeeAccountsState> = {
  feeAccounts: fromFeeAccounts.reducer,
  singleFeeAccount: fromSingleFeeAccount.reducer,
};

export const getRootFeeAccountsState = createFeatureSelector<FeeAccountsState>(
  'feeAccounts'
);
