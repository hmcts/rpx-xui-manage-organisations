import * as fromLogin from './login.actions';

describe('Login actions', () => {
  describe('LoginUser actions GROUP', () => {
    // Init state
    describe('LoginUser', () => {
      it('should create an action', () => {
        const action = new fromLogin.LoginUser({ userName: 'dummy', password: 'qwerty' });
        expect({ ...action }).toEqual({
          type: fromLogin.LOGIN_USER,
          payload: { userName: 'dummy', password: 'qwerty' }
        });
      });
    });
    // Success
    describe('LoginUserSuccess', () => {
      it('should create an action', () => {
        const payload = {
          firstname: 'John',
          lastname: 'Smith',
          email: 'duda@dudee.com',
          password: 'qwerty',
          permission: 'superuser'
        };
        const action = new fromLogin.LoginUserSuccess({
          firstname: 'John',
          lastname: 'Smith',
          email: 'duda@dudee.com',
          password: 'qwerty',
          permission: 'superuser'
        });
        expect({ ...action }).toEqual({
          type: fromLogin.LOGIN_USER_SUCCESS,
          payload
        });
      });
    });
    // Fail
    describe('LoginUserFail', () => {
      it('should create an action', () => {
        // Action is not been used. Should be passing error handler or error friendly string.
        const action = new fromLogin.LoginUserFail('Something');
        const payload = 'Something';
        expect({ ...action }).toEqual({
          type: fromLogin.LOGIN_USER_FAIL,
          payload
        });
      });
    });
  });
});
