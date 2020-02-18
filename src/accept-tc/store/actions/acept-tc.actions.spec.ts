import * as fromTandCAccounts from './acept-tc.actions';

describe('Accept Terms and Conditions actions GROUP', () => {
  // Init state
  describe('Accept Terms and Condition ', () => {
    it('accept T&C', () => {
      const action = new fromTandCAccounts.AcceptTandC('1234');
      expect({ ...action }).toEqual({
        type: fromTandCAccounts.ACCEPT_T_AND_C,
        payload: '1234'
      });
    });
  });
  // Success
  describe('LoadFeeAccountsSuccess', () => {
    it('should create an action', () => {
      const payload = true;
      const action = new fromTandCAccounts.AcceptTandCSuccess(payload);
      expect({ ...action }).toEqual({
        type: fromTandCAccounts.ACCEPT_T_AND_C_SUCCESS,
        payload
      });
    });
  });
  // Fail
  describe('LoadFeeAccountsFail', () => {
    it('should create an action', () => {
      // Action is not been used. Should be passing error handler or error friendly string.
      const payload = 'Something';
      const action = new fromTandCAccounts.AcceptTandCFail(payload);
      expect({ ...action }).toEqual({
        type: fromTandCAccounts.ACCEPT_T_AND_C_FAIL,
        payload
      });
    });
  });
});

