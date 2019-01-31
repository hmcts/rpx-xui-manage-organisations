import { initialState, reducer, getSingleFeeAccount,
  getSingleFeeAccountLoading, getSingleFeeAccountLoaded } from './single-fee-account.reducer';
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
      const action = new LoadSingleFeeAccountSuccess([{}]);
      const state = reducer(initialState, action);
      expect(state.singleFeeAccount).toEqual([{}]);
    });
  });

  describe('RESET_SINGLE_FEE_ACCOUNT action', () => {
    it('should return the initial state', () => {
      const action = new ResetSingleFeeAccount({});
      const state = reducer(initialState, action);
      expect(state.singleFeeAccount).toEqual([]);
    });
  });

  describe('getSingleFeeAccount export', () => {
    it('should return state.feeAccounts', () => {
      expect(getSingleFeeAccount(initialState)).toEqual([]);
    });
  });

  describe('getSingleFeeAccountLoading export', () => {
    it('should return state.loading', () => {
      expect(getSingleFeeAccountLoading(initialState)).toEqual(false);
    });
  });

  describe('getSingleFeeAccountLoaded export', () => {
    it('should return state.loaded', () => {
      expect(getSingleFeeAccountLoaded(initialState)).toEqual(false);
    });
  });
});
