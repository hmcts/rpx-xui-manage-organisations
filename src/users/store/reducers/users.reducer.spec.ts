import { PrdUser } from 'src/users/models/prd-users.model';
import * as fromUserActions from '../actions/user.actions';
import * as fromUsers from './users.reducer';

const mockUserList: PrdUser[] = [
  {
    firstName: 'Test1firstname',
    lastName: 'Test1lastname',
    fullName: 'Test1firstname Test1lastname',
    routerLink: 'user/userId1',
    routerLinkTitle: 'User details for Test1firstname Test1lastname with id userId1',
    email: 'somthing1@something',
    idamStatus: 'active',
    userIdentifier: 'userId1',
    roles: ['pui-organisation-manager', 'pui-user-manager', 'pui-case-manager', 'pui-finance-manager'],
    userAccessTypes: []
  },
  {
    firstName: 'Test2fggftfirstname',
    lastName: 'Test2gfgtlastname',
    fullName: 'Test2fggftfirstname Test2gfgtlastname',
    routerLink: 'user/userId2',
    routerLinkTitle: 'User details for Test2fggftfirstname Test2gfgtlastname with id userId2',
    email: 'somthing2@somffgething',
    idamStatus: 'active',
    userIdentifier: 'userId2',
    roles: ['pui-organisation-manager', 'pui-user-manager'],
    userAccessTypes: []
  }
];

const resultUserList = [
  {
    firstName: 'Test1firstname',
    lastName: 'Test1lastname',
    fullName: 'Test1firstname Test1lastname',
    routerLink: 'user/userId1',
    routerLinkTitle: 'User details for Test1firstname Test1lastname with id userId1',
    email: 'somthing1@something',
    idamStatus: 'active',
    userIdentifier: 'userId1',
    selected: false,
    status: 'Active',
    roles: ['pui-organisation-manager', 'pui-user-manager', 'pui-case-manager', 'pui-finance-manager'],
    manageOrganisations: 'Yes',
    manageUsers: 'Yes',
    manageCases: 'Yes',
    managePayments: 'Yes',
    userAccessTypes: []
  },
  {
    firstName: 'Test2fggftfirstname',
    lastName: 'Test2gfgtlastname',
    fullName: 'Test2fggftfirstname Test2gfgtlastname',
    routerLink: 'user/userId2',
    routerLinkTitle: 'User details for Test2fggftfirstname Test2gfgtlastname with id userId2',
    email: 'somthing2@somffgething',
    idamStatus: 'active',
    userIdentifier: 'userId2',
    selected: false,
    status: 'Active',
    roles: ['pui-organisation-manager', 'pui-user-manager'],
    manageOrganisations: 'Yes',
    manageUsers: 'Yes',
    manageCases: 'No',
    managePayments: 'No',
    userAccessTypes: []
  }
];

const userDetails = {
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
};

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

  it('EDIT_USER_FAILURE action should set editUserFailure to true, so that the application' +
      'knows that its in an edit user failure state.', () => {
    const { initialState } = fromUsers;

    const action = new fromUserActions.EditUserFailure('');
    const state = fromUsers.reducer(initialState, action);

    expect(state.editUserFailure).toBeTruthy();
  });

  /**
     * The User has made our application fall into a editUserFailure state, therefore
     * when we setup this test we want editUserFailure to be true.
     *
     * We then test that applying the EditUserFailureReset action onto the Store
     * changes editUserFailure state.
     */
  it('EDIT_USER_FAILURE_RESET action should reset editUserFailure', () => {
    const { initialState } = fromUsers;
    const action = new fromUserActions.EditUserFailure('');
    fromUsers.reducer(initialState, action);

    const action2 = new fromUserActions.EditUserFailureReset();
    const state2 = fromUsers.reducer(initialState, action2);

    expect(state2.editUserFailure).toBeFalsy();
  });

  it('LOAD_USER_DETAILS action should load user details', () => {
    const { initialState } = fromUsers;
    const userIdentifier = { fullName: 'dummy' };
    const action = new fromUserActions.LoadUserDetails(userIdentifier);
    const state = fromUsers.reducer(initialState, action);
    expect(state.userDetails.fullName).toBe('dummy');
  });

  it('LOAD_USER_DETAILS_SUCCESS action should load user details successfully', () => {
    const { initialState } = fromUsers;
    const action = new fromUserActions.LoadUserDetailsSuccess(userDetails);
    const state = fromUsers.reducer(initialState, action);
    expect(fromUsers.getUserDetails(state)).toEqual(userDetails);
  });

  it('LOAD_ALL_USERS_NO_ROLE_DATA action should return correct state', () => {
    const { initialState } = fromUsers;

    const action = new fromUserActions.LoadAllUsersNoRoleData();
    const state = fromUsers.reducer(initialState, action);

    expect(state.userList).toEqual([]);
  });

  it('LOAD_ALL_USERS_NO_ROLE_DATA_SUCCESS action should return correct state', () => {
    const { initialState } = fromUsers;

    const action = new fromUserActions.LoadAllUsersNoRoleDataSuccess({
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

  it('LOAD_ALL_USERS_NO_ROLE_DATA_FAIL action should return correct state', () => {
    const { initialState } = fromUsers;

    const action = new fromUserActions.LoadAllUsersNoRoleDataFail({});
    const state = fromUsers.reducer(initialState, action);

    expect(state.userList).toEqual([]);
  });

  it('CHECK_USER_LIST_LOADED action should update loadUserListNeeded based on userList emptiness', () => {
    const { initialState } = fromUsers;
    let state = fromUsers.reducer(initialState, new fromUserActions.CheckUserListLoaded());

    expect(state.loadUserListNeeded).toEqual(true);

    const action = new fromUserActions.LoadUsersSuccess({ users: mockUserList });
    state = fromUsers.reducer(state, action);
    state = fromUsers.reducer(state, new fromUserActions.CheckUserListLoaded());

    expect(state.loadUserListNeeded).toEqual(false);
  });
});

