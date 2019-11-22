import * as fromFeeAccounts from './fee-accounts.actions';

describe('Accept Terms and Conditions', () => {
  describe('LoadFeeAccounts actions GROUP', () => {
    // Init state
    describe('LoadFeeAccounts', () => {
      it('should create an action', () => {
        const action = new fromFeeAccounts.LoadFeeAccounts(['account1', 'account2']);
        expect({ ...action }).toEqual({
          type: fromFeeAccounts.LOAD_FEE_ACCOUNTS,
          paymentAccounts: ['account1', 'account2']
        });
      });
    });
    // Success
    describe('LoadFeeAccountsSuccess', () => {
      it('should create an action', () => {
        const payload = [{payload: 'something', pageId: 'someString'}];
        const action = new fromFeeAccounts.LoadFeeAccountsSuccess([{payload: 'something', pageId: 'someString'}]);
        expect({ ...action }).toEqual({
          type: fromFeeAccounts.LOAD_FEE_ACCOUNTS_SUCCESS,
          payload
        });
      });
    });
    // Fail
    describe('LoadFeeAccountsFail', () => {
      it('should create an action', () => {
        // Action is not been used. Should be passing error handler or error friendly string.
        const action = new fromFeeAccounts.LoadFeeAccountsFail('Something');
        const payload = 'Something';
        expect({ ...action }).toEqual({
          type: fromFeeAccounts.LOAD_FEE_ACCOUNTS_FAIL,
          payload
        });
      });
    });
  });
});
