import { initialState, reducer } from './fee-accounts.reducer';
import { LoadFeeAccountsSuccess } from '../actions';

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
      const action = new LoadFeeAccountsSuccess([{}]);
      const state = reducer(initialState, action);
      expect(state.feeAccounts).toEqual([{}]);
    });
  });
});
