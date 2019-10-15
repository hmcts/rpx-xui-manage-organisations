import * as fromFeeAccountActions from '../actions/fee-accounts.actions';
import {PbaAccounts, PbaAccountsSummary, FeeAccount, FeeAccountSummary} from '../../models/pba-accounts';

export interface FeeAccountsState {
  feeAccounts: Array<FeeAccount> | null;
  loaded: boolean;
  loading: boolean;
}

export const initialState: FeeAccountsState = {
  feeAccounts: null,
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromFeeAccountActions.FeeAccountsActions
): FeeAccountsState {
  switch (action.type) {

    case fromFeeAccountActions.LOAD_FEE_ACCOUNTS: {
      return {
        ...state,
        loaded: false,
        loading: true
      };
    }
    case fromFeeAccountActions.LOAD_FEE_ACCOUNTS_SUCCESS: {
      const payload = action.payload;
      let feeAccounts = payload;
      if (feeAccounts.length !== 0) {
        feeAccounts = payload.map((entity: FeeAccount) => {
            const element: FeeAccountSummary = {
              ...entity,
              routerLink: `/fee-accounts/account/${entity.account_number}/`
            };
            return element;
          });
      }

      return {
        ...state,
          feeAccounts,
          loaded: true,
          loading: false
      };
    }

  }

  return state;
}

export const getFeeAccounts = (state: FeeAccountsState) => state.feeAccounts;
export const getFeeAccountsLoading = (state: FeeAccountsState) => state.loading;
export const getFeeAccountsLoaded = (state: FeeAccountsState) => state.loaded;
