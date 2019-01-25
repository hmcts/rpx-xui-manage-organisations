import * as fromFeeAccountSummaryActions from '../actions/fee-account-summary.actions';

export interface FeeAccountSummaryState {
  feeAccountSummary: any[];
  loaded: boolean;
  loading: boolean;
}

export const initialState: FeeAccountSummaryState = {
  feeAccountSummary: [],
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromFeeAccountSummaryActions.FeeAccountSummaryActions
): FeeAccountSummaryState {
  switch (action.type) {
    case fromFeeAccountSummaryActions.LOAD_FEE_ACCOUNT_SUMMARY_SUCCESS: {
      const feeAccountSummary = action.payload;
        alert(action.type);
      return {
        ...state,
        feeAccountSummary,
        loaded: true
      };

    }

  }

  return state;
}

export const getFeeAccountSummary = (state: FeeAccountSummaryState) => state.feeAccountSummary;
export const getFeeAccountSummaryLoading = (state: FeeAccountSummaryState) => state.loading;
export const getFeeAccountSummaryLoaded = (state: FeeAccountSummaryState) => state.loaded;
