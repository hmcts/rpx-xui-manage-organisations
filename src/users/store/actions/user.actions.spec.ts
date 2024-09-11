import {
  EDIT_USER_FAILURE,
  EDIT_USER_FAILURE_RESET,
  EditUserFailure,
  EditUserFailureReset,
  LOAD_ALL_USERS_NO_ROLE_DATA,
  LOAD_ALL_USERS_NO_ROLE_DATA_FAIL,
  LOAD_ALL_USERS_NO_ROLE_DATA_SUCCESS,
  LOAD_USER_DETAILS,
  LOAD_USER_DETAILS_SUCCESS,
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
