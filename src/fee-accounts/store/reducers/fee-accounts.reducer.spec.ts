import { initialState, reducer, getFeeAccounts, getFeeAccountsLoading, getFeeAccountsLoaded } from './fee-accounts.reducer';
import { LoadFeeAccountsSuccess } from '../actions';
import { FeeAccount, FeeAccountSummary } from 'src/fee-accounts/models/pba-accounts';

describe('FeeAccountsReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = reducer( undefined, action);
      expect(state).toEqual(initialState);
    });
  });

  describe('LOAD_FEE_ACCOUNTS_SUCCESS action', () => {
    it('should update the state.feeAccounts', () => {
      const action = new LoadFeeAccountsSuccess([
        {
          account_number: '123',
          account_name: '',
          credit_limit: null,
          available_balance: null,
          status: null,
          effective_date: null,
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
        routerLink: `/fee-accounts/account/123/`,
        isAccountInfoMissing: false
      };
      expect(state.feeAccounts).toEqual([expected]);
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
});
