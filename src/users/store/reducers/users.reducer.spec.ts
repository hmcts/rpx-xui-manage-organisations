import * as fromUserActions from '../actions/user.actions';
import * as fromUsers from './users.reducer';

const mockUserList = [
    {
        firstName: 'Test1firstname',
        lastName: 'Test1lastname',
        email: 'somthing1@something',
        idamStatus: 'active',
        userIdentifier: 'userId1',
        roles: ['pui-organisation-manager', 'pui-user-manager', 'pui-case-manager', 'pui-finance-manager']
    },
    {
        firstName: 'Test2fggftfirstname',
        lastName: 'Test2gfgtlastname',
        email: 'somthing2@somffgething',
        idamStatus: 'active',
        userIdentifier: 'userId2',
        roles: ['pui-organisation-manager', 'pui-user-manager']
    }
];

const resultUserList = [
    {
        firstName: 'Test1firstname',
        lastName: 'Test1lastname',
        email: 'somthing1@something',
        idamStatus: 'active',
        userIdentifier: 'userId1',
        selected: false,
        status: 'Active',
        roles: ['pui-organisation-manager', 'pui-user-manager', 'pui-case-manager', 'pui-finance-manager'],
        manageOrganisations: 'Yes',
        manageUsers: 'Yes',
        manageCases: 'Yes',
        managePayments: 'Yes'
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
        managePayments: 'No'
    }
];

describe('Users Reducer', () => {
    it('undefined action should return the default state', () => {
        const { initialState } = fromUsers;
        const action = {} as any;
        const state = fromUsers.reducer(undefined, action);

        expect(state).toBe(initialState);
    });

    it('LOAD_USERS_SUCCESS action should return correct state', () => {
        const { initialState } = fromUsers;

        const action = new fromUserActions.LoadUsersSuccess({
            users: mockUserList
        });
        const state = fromUsers.reducer(initialState, action);

        expect(state.userList).toEqual(resultUserList);
        expect(fromUsers.getUsers(state)).toEqual(resultUserList);
        expect(fromUsers.getUsersLoaded(state)).toEqual(true);
        expect(fromUsers.getUsersLoading(state)).toEqual(false);
        expect(state.loaded).toEqual(true);
        expect(state.loading).toEqual(false);
    });

    it('LOAD_USERS action should return correct state', () => {
        const { initialState } = fromUsers;

        const action = new fromUserActions.LoadUsers();
        const state = fromUsers.reducer(initialState, action);

        expect(state.userList).toEqual([]);
    });

    it('LOAD_USERS_FAIL action should return correct state', () => {
        const { initialState } = fromUsers;

        const action = new fromUserActions.LoadUsersFail({});
        const state = fromUsers.reducer(initialState, action);

        expect(state.userList).toEqual([]);
    });

    it('INVITE_NEW_USER action should return correct state', () => {
      const { initialState } = fromUsers;

      const action = new fromUserActions.InviteNewUser();
      const state = fromUsers.reducer(initialState, action);

      expect(state.reinvitePendingUser).toEqual(null);
    });

    it('REINVITE_PENDING_USER action should return correct state', () => {
      const { initialState } = fromUsers;

      const action = new fromUserActions.ReinvitePendingUser(mockUserList[0]);
      const state = fromUsers.reducer(initialState, action);

      expect(state.reinvitePendingUser).toEqual(mockUserList[0]);
  });

});

