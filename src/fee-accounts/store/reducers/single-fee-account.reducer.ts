import * as fromSingleFeeAccountActions from '../actions/single-fee-account.actions';
import {SingleAccontSummary} from '../../models/single-account-summary';



export interface SingleFeeAccountState {
  overview: {
    data: {}  | SingleAccontSummary;
    loaded: boolean;
    loading: boolean;
  };
  transactions: {
    data: {}  | SingleAccontSummary;
    loaded: boolean;
    loading: boolean;
  }
}

export const initialState: SingleFeeAccountState = {
 overview: {
   data: {},
   loaded: false,
   loading: false,
 },
  transactions: {
    data: {},
    loaded: false,
    loading: false,
  }
};

export function reducer(
  state = initialState,
  action: fromSingleFeeAccountActions.SingleFeeAccountActions
): SingleFeeAccountState {
  switch (action.type) {
    case fromSingleFeeAccountActions.LOAD_SINGLE_FEE_ACCOUNT_SUCCESS: {
      const payload = action.payload;
      return {
        ...state,
        overview: {
          data: action.payload,
          loaded: true,
          loading: false
        }

      };

    }
    case fromSingleFeeAccountActions.LOAD_SINGLE_FEE_ACCOUNT_TRANSACTIONS_SUCCESS: {
      const payload = action.payload;
      return {
        ...state,
        transactions: {
          data: action.payload,
          loaded: true,
          loading: false
        }
      };

    }
    case fromSingleFeeAccountActions.RESET_SINGLE_FEE_ACCOUNT: {
      return initialState;
    }

  }

  return state;
}

export const getSingleFeeAccountOverview = (state: SingleFeeAccountState) => state.overview.data;
export const getSingleFeeAccountOverviewLoading = (state: SingleFeeAccountState) => state.overview.loading;
export const getSingleFeeAccountOverviewLoaded = (state: SingleFeeAccountState) => state.overview.loaded;

export const getSingleFeeAccountTransactions = (state: SingleFeeAccountState) => state.transactions.data;
export const getSingleFeeAccountTransactionsLoading = (state: SingleFeeAccountState) => state.transactions.loading;
export const getSingleFeeAccountTransactionsLoaded = (state: SingleFeeAccountState) => state.transactions.loaded;
