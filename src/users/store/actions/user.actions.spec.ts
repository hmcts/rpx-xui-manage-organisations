import {EDIT_USER_FAILURE, EDIT_USER_FAILURE_RESET, EditUserFailure, EditUserFailureReset} from './user.actions';

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
});
