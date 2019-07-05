import * as fromAuth from './auth.reducer';
import * as fromAuthActions from '../actions/user-profile.actions';
import { UserModel} from '../../models/user.model';

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
            id: 'id',
            emailId: 'email',
            firstName: 'first name',
            lastName: 'last name',
            status: 'status',
            organisationId: 'org id',
            pbaAccount: 'pba acc',
            addresses: [],
            roles: []
        });
        const state = fromAuth.reducer(initialState, action);

        const expectedUser = new UserModel({
            id: 'id',
            emailId: 'email',
            firstName: 'first name',
            lastName: 'last name',
            status: 'status',
            organisationId: 'org id',
            pbaAccount: 'pba acc',
            addresses: [],
            roles: []
        });

        expect(state.isAuthenticated).toEqual(true);
        expect(state.user).toEqual(expectedUser);
        expect(state.loaded).toEqual(true);
        expect(state.loading).toEqual(false);
    });

    it('LOGOUT action should return correct state', () => {
        const { initialState } = fromAuth;

        const action = new fromAuthActions.LogOut();
        const state = fromAuth.reducer(initialState, action);

        expect(state.isAuthenticated).toEqual(false);
        expect(state.user).toEqual(null);
        expect(state.loaded).toEqual(false);
        expect(state.loading).toEqual(false);
    });

    it('should return correct state properties', () => {
        const payload: fromAuth.AuthState = {
            isAuthenticated: true,
            loaded: true,
            loading: false,
            user: null
        };

        expect(fromAuth.isAuthenticated(payload)).toEqual(true);
        expect(fromAuth.getUser(payload)).toEqual(null);
        expect(fromAuth.isUserLoaded(payload)).toEqual(true);
        expect(fromAuth.isUserLoading(payload)).toEqual(false);

    });

});

