import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromFeeAccounts from './fee-accounts.reducer';


export interface FeeAccountsState {
  feeAccounts: fromFeeAccounts.FeeAccountsState;
}

export const reducers: ActionReducerMap<FeeAccountsState> = {
  feeAccounts: fromFeeAccounts.reducer,
};

export const getRootFeeAccountsState = createFeatureSelector<FeeAccountsState>(
  'feeAccounts'
);
