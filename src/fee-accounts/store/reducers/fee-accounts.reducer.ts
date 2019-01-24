import * as fromFeeActions from '../actions/fee-accounts.actions';


export interface FeeAccountsState {
  feeAccounts: any[]; // todo add type user model
  loaded: boolean;
  loading: boolean;
}

export const initialState: FeeAccountsState = {
  feeAccounts: [],
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromFeeActions.FeeAccountsActions
): FeeAccountsState {
  switch (action.type) {
    case fromFeeActions.LOAD_FEE_ACCOUNTS_SUCCESS: {
      const feeAccounts = action.payload;

      return {
        ...state,
        feeAccounts,
        loaded: true
      };

    }

  }

  return state;
}

export const getFeeAccounts = (state: FeeAccountsState) => state.feeAccounts;
export const getFeeAccountsLoading = (state: FeeAccountsState) => state.loading;
export const getFeeAccountsLoaded = (state: FeeAccountsState) => state.loaded;

