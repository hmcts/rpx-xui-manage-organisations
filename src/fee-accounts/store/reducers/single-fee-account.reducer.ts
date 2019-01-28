import * as fromSingleFeeAccountActions from '../actions/single-fee-account.actions';

export interface SingleFeeAccountState {
  singleFeeAccount: any[];
  loaded: boolean;
  loading: boolean;
}

export const initialState: SingleFeeAccountState = {
  singleFeeAccount: [],
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromSingleFeeAccountActions.SingleFeeAccountActions
): SingleFeeAccountState {
  switch (action.type) {
    case fromSingleFeeAccountActions.LOAD_SINGLE_FEE_ACCOUNT_SUCCESS: {
      const singleFeeAccount = action.payload;

      return {
        ...state,
        singleFeeAccount,
        loaded: true
      };

    }

    case fromSingleFeeAccountActions.RESET_SINGLE_FEE_ACCOUNT: {
      return initialState;
    }

  }

  return state;
}

export const getSingleFeeAccount = (state: SingleFeeAccountState) => state.singleFeeAccount;
export const getSingleFeeAccountLoading = (state: SingleFeeAccountState) => state.loading;
export const getSingleFeeAccountLoaded = (state: SingleFeeAccountState) => state.loaded;
