import { FeeAccountSummary } from 'src/fee-accounts/models/pba-accounts';
import { LoadFeeAccounts, LoadFeeAccountsSuccess, LoadFeeOneOrMoreAccountsFail, LoadFeeAccountResetState } from '../actions';
import {
  getFeeAccountErrorMessages,
  getFeeAccounts,
  getFeeAccountsLoaded,
  getFeeAccountsLoading,
  getOneOrMoreAccountMissingLoaded,
  initialState,
  reducer
} from './fee-accounts.reducer';

describe('FeeAccountsReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = reducer(undefined, action);
      expect(state).toEqual(initialState);
    });
  });

  describe('LOAD_FEE_ACCOUNTS_SUCCESS action', () => {
    it('should set loading state when accounts are requested', () => {
      const state = reducer(initialState, new LoadFeeAccounts(['123']));

      expect(state.loading).toBeTrue();
      expect(state.loaded).toBeFalse();
    });

    it('should update the state.feeAccounts', () => {
      const action = new LoadFeeAccountsSuccess([
        {
          account_number: '123',
          account_name: '',
          credit_limit: null,
          available_balance: null,
          status: null,
          effective_date: null
        }
      ]);
      const state = reducer(initialState, action);
      const expected: FeeAccountSummary = {
        account_number: '123',
        account_name: '',
        credit_limit: null,
        available_balance: null,
        status: null,
        effective_date: null,
        routerLink: '/fee-accounts/account/123/',
        isAccountInfoMissing: false
      };
      expect(state.feeAccounts).toEqual([expected]);
    });

    it('should handle an empty fee account response', () => {
      const state = reducer(initialState, new LoadFeeAccountsSuccess([]));

      expect(state.feeAccounts).toEqual([]);
      expect(state.oneOrMoreAccountMissing).toBeFalse();
      expect(state.errorMessages).toEqual([]);
    });
  });

  describe('LOAD_FEE_ONE_OR_MORE_ACCOUNTS_FAIL action', () => {
    it('should mark missing account information and build error messages', () => {
      const state = reducer(initialState, new LoadFeeOneOrMoreAccountsFail([
        {
          account_number: '123',
          account_name: '',
          credit_limit: null,
          available_balance: null,
          status: null,
          effective_date: null
        },
        {
          account_number: '456',
          account_name: 'Valid account',
          credit_limit: null,
          available_balance: null,
          status: null,
          effective_date: null
        }
      ]));
      const feeAccounts = state.feeAccounts as FeeAccountSummary[];

      expect(state.oneOrMoreAccountMissing).toBeTrue();
      expect(feeAccounts[0].isAccountInfoMissing).toBeTrue();
      expect(feeAccounts[0].routerLink).toBe('');
      expect(feeAccounts[1].routerLink).toBe('/fee-accounts/account/456/');
      expect(state.errorMessages).toEqual([
        'Account number 123 not found. Contact your service representative for help'
      ]);
    });
  });

  describe('LOAD_FEE_RESET_STATE action', () => {
    it('should reset loading flags and errors', () => {
      const state = reducer({
        ...initialState,
        loaded: true,
        loading: true,
        errorMessages: ['message']
      }, new LoadFeeAccountResetState());

      expect(state.loaded).toBeFalse();
      expect(state.loading).toBeFalse();
      expect(state.errorMessages).toEqual([]);
    });
  });

  describe('getFeeAccounts export', () => {
    it('should return state.feeAccounts', () => {
      expect(getFeeAccounts(initialState)).toEqual(null);
    });
  });

  describe('getFeeAccountsLoading export', () => {
    it('should return state.loading', () => {
      expect(getFeeAccountsLoading(initialState)).toEqual(false);
    });
  });

  describe('getFeeAccountsLoaded export', () => {
    it('should return state.loaded', () => {
      expect(getFeeAccountsLoaded(initialState)).toEqual(false);
    });
  });

  describe('getOneOrMoreAccountMissingLoaded export', () => {
    it('should return state.oneOrMoreAccountMissing', () => {
      expect(getOneOrMoreAccountMissingLoaded(initialState)).toEqual(false);
    });
  });

  describe('getFeeAccountErrorMessages export', () => {
    it('should return state.errorMessages', () => {
      expect(getFeeAccountErrorMessages(initialState)).toEqual(null);
    });
  });
});
