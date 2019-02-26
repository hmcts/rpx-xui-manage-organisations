import * as fromFeeAccountActions from '../actions/fee-accounts.actions';
import {SingleAccontSummary, SingleAccontSummaryRemapped} from '../../models/single-account-summary';
import {map} from '../../../../node_modules/rxjs/operators';

export interface FeeAccountsState {
  feeAccounts: Array<SingleAccontSummary> | null;
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

      const feeAccounts = action.payload;

      if (feeAccounts.length !== 0) {
        feeAccounts.map((entity: SingleAccontSummary) => {
            const element: SingleAccontSummaryRemapped = {
              ...entity,
              routerLink: `/fee-accounts/account/${entity.account_number}/summary`
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
