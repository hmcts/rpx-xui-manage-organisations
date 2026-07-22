import { UserModel } from '../../models/user.model';
import * as fromAuthActions from '../actions/user-profile.actions';
import * as fromAuth from './user-profile.reducer';

describe('User Profile Reducer', () => {
  it('undefined action should return the default state', () => {
    const { initialState } = fromAuth;
    const action = {} as any;
    const state = fromAuth.reducer(undefined, action);

    expect(state).toBe(initialState);
  });

  it('GET_USER_DETAILS_SUCCESS action should return correct state', () => {
    const { initialState } = fromAuth;

    const action = new fromAuthActions.GetUserDetailsSuccess({
      orgId: 'id',
      email: 'email',
      roles: [],
      sessionTimeout: {
        idleModalDisplayTime: 10,
        totalIdleTime: 50
      },
      userId: ''
    });
    const state = fromAuth.reducer(initialState, action);

    const expectedUser = new UserModel({
      orgId: 'id',
      email: 'email',
      roles: [],
      sessionTimeout: {
        idleModalDisplayTime: 10,
        totalIdleTime: 50
      },
      userId: ''
    });

    expect(state.isAuthenticated).toEqual(true);
    expect(state.user).toEqual(expectedUser);
    expect(state.loaded).toEqual(true);
    expect(state.loading).toEqual(false);
  });

  it('should return correct state properties', () => {
    const payload: fromAuth.AuthState = {
      isAuthenticated: true,
      tAndC: { hasUserAccepted: 'false', loaded: false },
      loaded: true,
      loading: false,
      user: null
    };

    expect(fromAuth.isAuthenticated(payload)).toEqual(true);
    expect(fromAuth.getUserConfig(payload)).toEqual(null);
    expect(fromAuth.isUserLoaded(payload)).toEqual(true);
    expect(fromAuth.isUserLoading(payload)).toEqual(false);
  });

  it('LOAD_HAS_ACCEPTED_TC_SUCCESS should return correct state properties', () => {
    const { initialState } = fromAuth;
    const payload = 'true';
    const action = new fromAuthActions.LoadHasAcceptedTCSuccess(payload);
    const state = fromAuth.reducer(initialState, action);
    expect(state.tAndC).toEqual({ hasUserAccepted: 'true', loaded: true });
  });

  it('ACCEPT_T_AND_C_SUCCESS should set accepted terms state', () => {
    const action = new fromAuthActions.AcceptTandCSuccess(true);
    const state = fromAuth.reducer(fromAuth.initialState, action);

    expect(state.tAndC).toEqual({ hasUserAccepted: 'true', loaded: true });
  });

  it('should expose accepted terms state through the selector helper', () => {
    const state: fromAuth.AuthState = {
      ...fromAuth.initialState,
      tAndC: { hasUserAccepted: 'true', loaded: true }
    };

    expect(fromAuth.gethasUserAcceptedTC(state)).toEqual({ hasUserAccepted: 'true', loaded: true });
  });

  it('should construct login actions with their payloads', () => {
    const loginPayload = { redirect: '/profile' };
    const error = new Error('login failed') as any;
    const loginAction = new fromAuthActions.LogIn(loginPayload);
    const loginFailureAction = new fromAuthActions.LogInFailure(error);

    expect(loginAction.type).toEqual(fromAuthActions.AuthActionTypes.LOGIN);
    expect(loginAction.payload).toEqual(loginPayload);
    expect(loginFailureAction.type).toEqual(fromAuthActions.AuthActionTypes.LOGIN_FAILURE);
    expect(loginFailureAction.payload).toEqual(error);
  });
});
