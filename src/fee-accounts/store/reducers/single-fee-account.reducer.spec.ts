import { initialState, reducer, getSingleFeeAccountOverview,
  getSingleFeeAccountOverviewLoading, getSingleFeeAccountOverviewLoaded } from './single-fee-account.reducer';
import { LoadSingleFeeAccountSuccess, ResetSingleFeeAccount } from '../actions';

describe('SingleFeeAccountReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = reducer( undefined, action);
      expect(state).toEqual(initialState);
    });
  });

  describe('LOAD_SINGLE_FEE_ACCOUNT_SUCCESS action', () => {
    it('should update the state.feeAccounts', () => {
      const payload = {
        account_number: 'someNumber',
        account_name: 'someName',
        credit_limit: 0,
        available_balance: 0,
        status: 'someStatus',
        effective_date: 'someDate'
      };
      const action = new LoadSingleFeeAccountSuccess(payload);
      const state = reducer(initialState, action);
      expect(state.overview).toEqual({data: { ...payload }, loaded: true, loading: false});
    });
  });

  describe('RESET_SINGLE_FEE_ACCOUNT action', () => {
    it('should return the initial state', () => {
      const action = new ResetSingleFeeAccount({});
      const state = reducer(initialState, action);
      expect(state.overview).toEqual({data: {}, loaded: false, loading: false});
    });
  });

  describe('getSingleFeeAccount export', () => {
    it('should return state.feeAccounts', () => {
      expect(getSingleFeeAccountOverview(initialState)).toEqual({});
    });
  });

  describe('getSingleFeeAccountLoading export', () => {
    it('should return state.loading', () => {
      expect(getSingleFeeAccountOverviewLoading(initialState)).toEqual(false);
    });
  });

  describe('getSingleFeeAccountLoaded export', () => {
    it('should return state.loaded', () => {
      expect(getSingleFeeAccountOverviewLoaded(initialState)).toEqual(false);
    });
  });
});
