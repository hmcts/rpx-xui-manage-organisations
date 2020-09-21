import * as fromAuth from './user-profile.reducer';
import * as fromAuthActions from '../actions/user-profile.actions';
import { UserModel} from '../../models/user.model';

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
            userId: '',
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
      expect(state.tAndC).toEqual({hasUserAccepted: 'true', loaded: true});

    });

});

