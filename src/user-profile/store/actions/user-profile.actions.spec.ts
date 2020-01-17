import * as fromUserProfile from './user-profile.actions';

describe('User Profile Actions', () => {
  describe('Load Config', () => {

    describe('Get user details', () => {
      it('should create an action', () => {
        const action = new fromUserProfile.GetUserDetails();
        expect({...action}).toEqual({
          type: fromUserProfile.AuthActionTypes.GET_USER_DETAILS,
        });
      });
    });

    describe('Sign Out ', () => {
      it('should have sign out action', () => {
        const action = new fromUserProfile.SignedOut();
        expect({...action}).toEqual({
          type: fromUserProfile.AuthActionTypes.SIGNED_OUT,
        });
      });

      it('should have sign out success action', () => {
        const action = new fromUserProfile.SignedOutSuccess();
        expect({...action}).toEqual({
          type: fromUserProfile.AuthActionTypes.SIGNED_OUT_SUCCESS,
        });
      });
    });

    describe('Get user details success', () => {
      it('should create an action', () => {
        const payload = {email: 'test@test.com', userId: '1234'} as any;
        const action = new fromUserProfile.GetUserDetailsSuccess(payload);
        expect({...action}).toEqual({
          type: fromUserProfile.AuthActionTypes.GET_USER_DETAILS_SUCCESS,
          payload
        });
      });
    });

    describe('Get user details failure', () => {
      it('should create an action', () => {
        const payload = {error: 'some error text', message: '', name: ''} as any;
        const action = new fromUserProfile.GetUserDetailsFailure(payload);
        expect({...action}).toEqual({
          type: fromUserProfile.AuthActionTypes.GET_USER_DETAILS_FAIL,
          payload
        });
      });
    });

  });
});
