import { initialState, reducer, getLoggedInUserData, getLoginFormLoaded, getLoginFormLoading } from './login.reducer';
import { LoginUserSuccess, LoginUser } from '../actions';

describe('LoginReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = reducer( undefined, action);
      expect(state).toEqual(initialState);
    });
  });

  describe('LOGIN_USER_SUCCESS action', () => {
    it('should update the state.user', () => {
      const action = new LoginUserSuccess({
        firstname: 'John',
        lastname: 'Smith',
        email: 'duda@dudee.com',
        password: 'qwerty',
        permission: 'superuser'
      });
      const state = reducer(initialState, action);
      expect(state.user).toEqual({
        firstname: 'John',
        lastname: 'Smith',
        email: 'duda@dudee.com',
        password: 'qwerty',
        permission: 'superuser'
      });
    });
  });

  describe('LOGIN_USER action', () => {
    it('should update the state.user', () => {
      const action = new LoginUser(null);
      const state = reducer(initialState, action);
      expect(state.user).toEqual(null);
    });
  });

  describe('getLogin export', () => {
    it('should return state.feeAccounts', () => {
      expect(getLoggedInUserData(initialState)).toEqual(null);
    });
  });

  describe('getLoginFormLoading export', () => {
    it('should return state.loading', () => {
      expect(getLoginFormLoading(initialState)).toEqual(false);
    });
  });

  describe('getLoginFormLoaded export', () => {
    it('should return state.loaded', () => {
      expect(getLoginFormLoaded(initialState)).toEqual(false);
    });
  });
});
