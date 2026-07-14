import {
  CHECK_USER_LIST_LOADED,
  CheckUserListLoaded,
  EDIT_USER_FAILURE,
  EDIT_USER_FAILURE_RESET,
  EditUserFailure,
  EditUserFailureReset,
  LOAD_ALL_USERS_NO_ROLE_DATA,
  LOAD_ALL_USERS_NO_ROLE_DATA_FAIL,
  LOAD_ALL_USERS_NO_ROLE_DATA_SUCCESS,
  LOAD_ALL_USERS,
  LOAD_ALL_USERS_SUCCESS,
  LOAD_ALL_USERS_FAIL,
  LOAD_USERS,
  LOAD_USERS_SUCCESS,
  LOAD_USERS_FAIL,
  INVALIDATE_USER_LIST_CACHE,
  EDIT_USER,
  EDIT_USER_SUCCESS,
  EDIT_USER_SERVER_ERROR,
  SUSPEND_USER,
  SUSPEND_USER_SUCCESS,
  SUSPEND_USER_FAIL,
  INVITE_NEW_USER,
  REINVITE_PENDING_USER,
  LOAD_USER_DETAILS,
  LOAD_USER_DETAILS_SUCCESS,
  InvalidateUserListCache,
  LoadAllUsers,
  LoadAllUsersSuccess,
  LoadAllUsersFail,
  LoadUsers,
  LoadUsersSuccess,
  LoadUsersFail,
  EditUser,
  EditUserSuccess,
  EditUserServerError,
  SuspendUser,
  SuspendUserSuccess,
  SuspendUserFail,
  InviteNewUser,
  ReinvitePendingUser,
  LoadAllUsersNoRoleData,
  LoadAllUsersNoRoleDataFail,
  LoadAllUsersNoRoleDataSuccess,
  LoadUserDetails,
  LoadUserDetailsSuccess
} from './user.actions';

describe('User actions', () => {
  it('should have a EditUserFailureReset action, used to reset editUserFailure on store.', () => {
    const action = new EditUserFailureReset();
    expect({ ...action }).toEqual({
      type: EDIT_USER_FAILURE_RESET
    });
  });

  it('should have a EditUserFailure action, used to set app state to editUserFailure true on store.', () => {
    const payload = {};
    const action = new EditUserFailure(payload);
    expect({ ...action }).toEqual({
      type: EDIT_USER_FAILURE,
      payload
    });
  });

  it('should have a LoadUserDetails action', () => {
    const payload = {};
    const action = new LoadUserDetails(payload);
    expect({ ...action }).toEqual({
      type: LOAD_USER_DETAILS,
      payload
    });
  });

  it('should have a LoadUserDetailsSuccess action', () => {
    const payload = {};
    const action = new LoadUserDetailsSuccess(payload);
    expect({ ...action }).toEqual({
      type: LOAD_USER_DETAILS_SUCCESS,
      payload
    });
  });

  it('should have a LoadAllUsersNoRoleData action, for loading the entire user list but without role data', () => {
    const action = new LoadAllUsersNoRoleData();
    expect({ ...action }).toEqual({
      type: LOAD_ALL_USERS_NO_ROLE_DATA
    });
  });

  it('should have a CheckUserListLoaded action, for checking the user list cache', () => {
    const payload = { currentTime: 123 };
    const action = new CheckUserListLoaded(payload);
    expect({ ...action }).toEqual({
      type: CHECK_USER_LIST_LOADED,
      payload
    });
  });

  it('should have an InvalidateUserListCache action, for clearing the user list cache', () => {
    const action = new InvalidateUserListCache();
    expect({ ...action }).toEqual({
      type: INVALIDATE_USER_LIST_CACHE
    });
  });

  it('should have a LoadAllUsersNoRoleDataSuccess action, triggered on successful retrieval of the user list', () => {
    const payload = { users: [] };
    const action = new LoadAllUsersNoRoleDataSuccess(payload);
    expect({ ...action }).toEqual({
      type: LOAD_ALL_USERS_NO_ROLE_DATA_SUCCESS,
      payload
    });
  });

  it('should have a LoadAllUsersNoRoleDataFail action, triggered on failure to retrieve the user list', () => {
    const payload = {};
    const action = new LoadAllUsersNoRoleDataFail(payload);
    expect({ ...action }).toEqual({
      type: LOAD_ALL_USERS_NO_ROLE_DATA_FAIL,
      payload
    });
  });

  it('should construct user list load actions', () => {
    const payload = { users: [] };

    expect({ ...new LoadUsers('page-1') }).toEqual({ type: LOAD_USERS, payload: 'page-1' });
    expect({ ...new LoadUsersSuccess(payload) }).toEqual({ type: LOAD_USERS_SUCCESS, payload });
    expect({ ...new LoadUsersFail('error') }).toEqual({ type: LOAD_USERS_FAIL, payload: 'error' });
    expect({ ...new LoadAllUsers() }).toEqual({ type: LOAD_ALL_USERS });
    expect({ ...new LoadAllUsersSuccess() }).toEqual({ type: LOAD_ALL_USERS_SUCCESS });
    expect({ ...new LoadAllUsersFail('error') }).toEqual({ type: LOAD_ALL_USERS_FAIL, payload: 'error' });
  });

  it('should construct edit, suspend and invite user actions', () => {
    const payload = { id: 'user-1' } as any;

    expect({ ...new EditUser(payload, ['ORG-1']) }).toEqual({ type: EDIT_USER, payload, orgProfileIds: ['ORG-1'] });
    expect({ ...new EditUserSuccess('user-1') }).toEqual({ type: EDIT_USER_SUCCESS, payload: 'user-1' });
    expect({ ...new EditUserServerError({ code: 500 }) }).toEqual({ type: EDIT_USER_SERVER_ERROR, payload: { code: 500 } });
    expect({ ...new SuspendUser(payload) }).toEqual({ type: SUSPEND_USER, payload });
    expect({ ...new SuspendUserSuccess(payload) }).toEqual({ type: SUSPEND_USER_SUCCESS, payload });
    expect({ ...new SuspendUserFail('error') }).toEqual({ type: SUSPEND_USER_FAIL, payload: 'error' });
    expect({ ...new InviteNewUser() }).toEqual({ type: INVITE_NEW_USER });
    expect({ ...new ReinvitePendingUser(payload) }).toEqual({ type: REINVITE_PENDING_USER, payload });
  });
});
