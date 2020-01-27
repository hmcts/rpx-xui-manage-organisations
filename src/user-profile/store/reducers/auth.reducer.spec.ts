import * as fromAuth from './auth.reducer';
import * as fromAuthActions from '../actions/user-profile.actions';
import { UserModel} from '../../models/user.model';
import * as fromApp from '../';
import * as fromAppActions from '../actions';

describe('Authorisation Reducer', () => {
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
            userId: ''
        });
        const state = fromAuth.reducer(initialState, action);

        const expectedUser = new UserModel({
            orgId: 'id',
            email: 'email',
            roles: [],
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
            loaded: true,
            loading: false,
            user: null,
            modal: {}
        };

        expect(fromAuth.isAuthenticated(payload)).toEqual(true);
        expect(fromAuth.getUser(payload)).toEqual(null);
        expect(fromAuth.isUserLoaded(payload)).toEqual(true);
        expect(fromAuth.isUserLoading(payload)).toEqual(false);

    });

    describe('SET_MODAL action', () => {
      it('should reset to init', () => {
        const { initialState } = fromApp;
        const payload = {session: {isVisible: false}};
        const action = new fromAppActions.SetModal(payload);
        const state = fromApp.reducer(initialState, action);

        expect(state.modal).toEqual(payload);
      });
    });

    describe('SIGNED_OUT_SUCCESS action', () => {
      it('should reset to init', () => {
        const { initialState } = fromApp;
        const action = new fromAppActions.SignedOutSuccess();
        const state = fromApp.reducer(initialState, action);
        expect(state).toEqual(initialState);
      });
    });

});

