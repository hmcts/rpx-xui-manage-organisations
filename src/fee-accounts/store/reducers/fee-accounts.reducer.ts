import { FeeAccount, FeeAccountSummary } from '../../models/pba-accounts';
import * as fromFeeAccountActions from '../actions/fee-accounts.actions';

export interface FeeAccountsState {
  feeAccounts: FeeAccount[] | null;
  oneOrMoreAccountMissing: boolean;
  loaded: boolean;
  loading: boolean;
  errorMessages: string[];
}

export const initialState: FeeAccountsState = {
  feeAccounts: null,
  oneOrMoreAccountMissing: false,
  loaded: false,
  loading: false,
  errorMessages: null
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
            routerLink: `/fee-accounts/account/${entity.account_number}/`,
            isAccountInfoMissing: false
          };
          return element;
        });
      }

      return {
        ...state,
        feeAccounts,
        oneOrMoreAccountMissing: false,
        loaded: true,
        loading: false,
        errorMessages: []
      };
    }
    case fromFeeAccountActions.LOAD_FEE_ONE_OR_MORE_ACCOUNTS_FAIL: {
      const payload = action.payload;
      let feeAccounts = payload;
      let errorMessages = new Array<string>();
      if (feeAccounts.length !== 0) {
        feeAccounts = payload.map((entity: FeeAccount) => {
          const element: FeeAccountSummary = {
            ...entity,
            routerLink: entity.account_name ? `/fee-accounts/account/${entity.account_number}/` : '',
            isAccountInfoMissing: entity.account_name === null || entity.account_name === undefined || entity.account_name === ''
          };
          if (element.isAccountInfoMissing) {
            // errorMessages.push(`Account number ${entity.account_number} not found. Contact your service representative for help`);
            errorMessages = [...errorMessages,
              `Account number ${entity.account_number} not found. Contact your service representative for help`];
          }
          return element;
        });
      }
      return {
        ...state,
        feeAccounts,
        oneOrMoreAccountMissing: true,
        loaded: true,
        loading: false,
        errorMessages
      };
    }

    case fromFeeAccountActions.LOAD_FEE_RESET_STATE: {
      const errorMessages = [];
      return {
        ...state,
        loaded: false,
        loading: false,
        errorMessages
      };
    }
  }

  return state;
}

export const getFeeAccounts = (state: FeeAccountsState) => state.feeAccounts;
export const getFeeAccountsLoading = (state: FeeAccountsState) => state.loading;
export const getFeeAccountsLoaded = (state: FeeAccountsState) => state.loaded;
export const getOneOrMoreAccountMissingLoaded = (state: FeeAccountsState) => state.oneOrMoreAccountMissing;
export const getFeeAccountErrorMessages = (state: FeeAccountsState) => state.errorMessages;
