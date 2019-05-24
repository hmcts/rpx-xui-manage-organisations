import { initialState, reducer, getSingleFeeAccountOverview,
  getSingleFeeAccountOverviewLoading, getSingleFeeAccountOverviewLoaded } from './single-fee-account.reducer';
import { LoadSingleFeeAccountSuccess, ResetSingleFeeAccount } from '../actions';

// getSingleFeeAccountOverview
// getSingleFeeAccountOverviewLoading
// getSingleFeeAccountOverviewLoaded
// getSingleFeeAccountTransactions
// getSingleFeeAccountTransactionsLoading
// getSingleFeeAccountTransactionsLoaded

describe('SingleFeeAccountReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = reducer( undefined, action);
      expect(state).toEqual(initialState);
    });
  });

  // describe('LOAD_SINGLE_FEE_ACCOUNT_SUCCESS action', () => {
  //   it('should update the state.feeAccounts', () => {
  //     const action = new LoadSingleFeeAccountSuccess([{}]);
  //     const state = reducer(initialState, action);
  //     expect(state.singleFeeAccount).toEqual([{}]);
  //   });
  // });

  // describe('RESET_SINGLE_FEE_ACCOUNT action', () => {
  //   it('should return the initial state', () => {
  //     const action = new ResetSingleFeeAccount({});
  //     const state = reducer(initialState, action);
  //     expect(state.singleFeeAccount).toEqual([]);
  //   });
  // });

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
