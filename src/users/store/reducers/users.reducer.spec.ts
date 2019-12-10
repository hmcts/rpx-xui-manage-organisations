import * as fromUsers from './users.reducer';
import * as fromUserActions from '../actions/user.actions';
import { User } from '../../../users/models/user.model';

const mockUserList: User[] = [
    {
        firstName: 'Test1firstname',
        lastName: 'Test1lastname',
        email: 'somthing1@something',
        idamStatus: 'active',
        userIdentifier: 'userId1',
        roles: ['pui-organisation-manager', 'pui-user-manager', 'pui-case-manager'],
        idamMessage: '',
        idamStatusCode: ''
    },
    {
        firstName: 'Test2fggftfirstname',
        lastName: 'Test2gfgtlastname',
        email: 'somthing2@somffgething',
        idamStatus: 'active',
        userIdentifier: 'userId2',
        roles: ['pui-organisation-manager', 'pui-user-manager'],
        idamMessage: '',
        idamStatusCode: ''
    }
];

const resultUserList: User[] = [
    {
        firstName: 'Test1firstname',
        lastName: 'Test1lastname',
        email: 'somthing1@something',
        idamStatus: 'active',
        userIdentifier: 'userId1',
        selected: false,
        status: 'Active',
        roles: ['pui-organisation-manager', 'pui-user-manager', 'pui-case-manager'],
        manageOrganisations: 'Yes',
        manageUsers: 'Yes',
        manageCases: 'Yes',
        idamStatusCode: '',
        idamMessage: ''
    },
    {
        firstName: 'Test2fggftfirstname',
        lastName: 'Test2gfgtlastname',
        email: 'somthing2@somffgething',
        idamStatus: 'active',
        userIdentifier: 'userId2',
        selected: false,
        status: 'Active',
        roles: ['pui-organisation-manager', 'pui-user-manager'],
        manageOrganisations: 'Yes',
        manageUsers: 'Yes',
        manageCases: 'No',
        idamStatusCode: '',
        idamMessage: ''
    }
];

describe('Users Reducer', () => {
    it('undefined action should return the default state', () => {
        const { initialUsersListState } = fromUsers;
        const action = {} as any;
        const state = fromUsers.reducer(undefined, action);

        expect(state).toBe(initialUsersListState);
    });

    it('LOAD_USERS_SUCCESS action should return correct state', () => {
        const { initialUsersListState } = fromUsers;

        const action = new fromUserActions.LoadUsersSuccess({
            users: mockUserList
        });
        const state = fromUsers.reducer(initialUsersListState, action);

        expect(state.userList).toEqual(resultUserList);
        expect(fromUsers.getUsers(state)).toEqual(resultUserList);
        expect(fromUsers.getUsersLoaded(state)).toEqual(true);
        expect(fromUsers.getUsersLoading(state)).toEqual(false);
        expect(state.loaded).toEqual(true);
        expect(state.loading).toEqual(false);
    });

    it('LOAD_USERS action should return correct state', () => {
        const { initialUsersListState } = fromUsers;

        const action = new fromUserActions.LoadUsers();
        const state = fromUsers.reducer(initialUsersListState, action);

        expect(state.userList).toEqual([]);
    });

    it('LOAD_USERS_FAIL action should return correct state', () => {
        const { initialUsersListState } = fromUsers;

        const action = new fromUserActions.LoadUsersFail({});
        const state = fromUsers.reducer(initialUsersListState, action);

        expect(state.userList).toEqual([]);
    });

});

