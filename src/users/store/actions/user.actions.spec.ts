import {
  EditUserFailure, EditUserFailureReset, EDIT_USER_FAILURE, EDIT_USER_FAILURE_RESET, LoadUserDetails,
  LOAD_USER_DETAILS, LoadUserDetailsSuccess, LOAD_USER_DETAILS_SUCCESS
} from './user.actions';

describe('User actions', () => {
  it('should have a EditUserFailureReset action, used to reset editUserFailure on store.', () => {
    const action = new EditUserFailureReset();
    expect({...action}).toEqual({
      type: EDIT_USER_FAILURE_RESET,
    });
  });

  it('should have a EditUserFailure action, used to set app state to editUserFailure true on store.', () => {
    const payload = {};
    const action = new EditUserFailure(payload);
    expect({...action}).toEqual({
      type: EDIT_USER_FAILURE,
      payload,
    });
  });

  it('should have a LoadUserDetails action', () => {
    const payload = {};
    const action = new LoadUserDetails(payload);
    expect({...action}).toEqual({
      type: LOAD_USER_DETAILS,
      payload,
    });
  });

  it('should have a LoadUserDetailsSuccess action', () => {
    const payload = {};
    const action = new LoadUserDetailsSuccess(payload);
    expect({...action}).toEqual({
      type: LOAD_USER_DETAILS_SUCCESS,
      payload,
    });
  });
});
