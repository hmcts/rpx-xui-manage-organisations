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
  INVALIDATE_USER_LIST_CACHE,
  LOAD_USER_DETAILS,
  LOAD_USER_DETAILS_SUCCESS,
  InvalidateUserListCache,
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
});
