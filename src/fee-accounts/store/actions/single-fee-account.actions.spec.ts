import * as fromSingleFeeAccount from './single-fee-account.actions';

describe('Single fee account actions', () => {
  describe('LoadSingleFeeAccount actions GROUP', () => {
    // Init state
    describe('LoadSingleFeeAccount', () => {
      it('should create an action', () => {
        const payload = 'A123';
        const action = new fromSingleFeeAccount.LoadSingleFeeAccount('A123');
        expect({ ...action }).toEqual({
          type: fromSingleFeeAccount.LOAD_SINGLE_FEE_ACCOUNT,
          payload
        });
      });
    });
    // Success
    describe('LoadSingleFeeAccountSuccess', () => {
      it('should create an action', () => {
        const payload = [{payload: 'something', pageId: 'someString'}];
        const action = new fromSingleFeeAccount.LoadSingleFeeAccountSuccess([{payload: 'something', pageId: 'someString'}]);
        expect({ ...action }).toEqual({
          type: fromSingleFeeAccount.LOAD_SINGLE_FEE_ACCOUNT_SUCCESS,
          payload
        });
      });
    });
    // Fail
    describe('LoadSingleFeeAccountFail', () => {
      it('should create an action', () => {
        // Action is not been used. Should be passing error handler or error friendly string.
        const action = new fromSingleFeeAccount.LoadSingleFeeAccountFail('Something');
        const payload = 'Something';
        expect({ ...action }).toEqual({
          type: fromSingleFeeAccount.LOAD_SINGLE_FEE_ACCOUNT_FAIL,
          payload
        });
      });
    });
    // Reset
    describe('LoadSingleFeeAccountReset', () => {
      it('should create an action', () => {
        const action = new fromSingleFeeAccount.ResetSingleFeeAccount('Something');
        const payload = 'Something';
        expect({ ...action }).toEqual({
          type: fromSingleFeeAccount.RESET_SINGLE_FEE_ACCOUNT,
          payload
        });
      });
    });
  });
});
