import * as fromAuth from './auth.reducer';
import * as fromAuthActions from '../actions/auth.actions';
import { UserModel} from '../../models/user.model';

describe('AppReducer', () => {
    it('undefined action should return the default state', () => {
        const { initialState } = fromAuth;
        const action = {} as any;
        const state = fromAuth.reducer(undefined, action);

        expect(state).toBe(initialState);
    });

    it('LOGIN_SUCCESS action should return correct state', () => {
        const { initialState } = fromAuth;

        const action = new fromAuthActions.LogInSuccess({
            jti: 'some jti',
            sub: 'some sub',
            iat: 0,
            exp: 0,
            data: 'some data',
            type: 'some type',
            id: 'some id',
            forename: 'some forename',
            surname: 'some surname',
            'default-service': 'some default service',
            loa: 0,
            'default-url': 'some default url',
            group: 'some group'
        });
        const state = fromAuth.reducer(initialState, action);

        expect(state.isAuthenticated).toEqual(true);
        expect(state.user).toEqual(null);
        expect(state.loaded).toEqual(false);
        expect(state.loading).toEqual(false);
        expect(state.permissions).toEqual('some data');
        expect(state.errors).toEqual(null);
    });

    it('USER_SUCCESS action should return correct state', () => {
        const { initialState } = fromAuth;

        const action = new fromAuthActions.GetUserDetailsSuccess({
            id: 'id',
            emailId: 'email',
            firstName: 'first name',
            lastName: 'last name',
            status: 'status',
            organisationId: 'org id',
            pbaAccount: 'pba acc',
            addresses: []
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
            addresses: []
        });

        expect(state.isAuthenticated).toEqual(false);
        expect(state.user).toEqual(expectedUser);
        expect(state.loaded).toEqual(true);
        expect(state.loading).toEqual(false);
        expect(state.permissions).toEqual('');
        expect(state.errors).toEqual(null);
    });

    it('LOGOUT action should return correct state', () => {
        const { initialState } = fromAuth;

        const action = new fromAuthActions.LogOut();
        const state = fromAuth.reducer(initialState, action);

        expect(state.isAuthenticated).toEqual(false);
        expect(state.user).toEqual(null);
        expect(state.loaded).toEqual(false);
        expect(state.loading).toEqual(false);
        expect(state.permissions).toEqual('');
        expect(state.errors).toEqual({ forgotPass: '', login: '' });
    });


});

