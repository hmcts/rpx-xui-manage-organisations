
import { LoadUsers, LOAD_USERS } from './user.actions';
import { LoadUsersSuccess, LOAD_USERS_SUCCESS } from './user.actions';
import { LoadUsersFail, LOAD_USERS_FAIL } from './user.actions';


fdescribe('LoadUsers', () => {
  it('should create an action', () => {
    const action = new LoadUsers();
    expect({ ...action }).toEqual({ type: LOAD_USERS });
  });
});



fdescribe('LoadUsersSuccess', () => {
  it('should create an action', () => {
    const payload: any[] = [
      {
        email: 'a@b.com',
        manageCases: 'yes',
        manageOrganisation: 'yes',
        manageUsers: 'yes',
        manageFeeAcc: 'yes',
        status: 'active'
      },
      {
        email: 'x@y.com',
        manageCases: 'yes',
        manageOrganisation: 'yes',
        manageUsers: 'yes',
        manageFeeAcc: 'yes',
        status: 'active'
      },
    ];
    const action = new LoadUsersSuccess(payload);
    expect({ ...action }).toEqual({
      type: LOAD_USERS_SUCCESS,
      payload,
    });
  });
});



fdescribe('LoadUsersFail', () => {
  it('should create an action', () => {
    const payload: any = 'fail';
    const action = new LoadUsersSuccess(payload);
    expect({ ...action }).toEqual({
      type: LOAD_USERS_SUCCESS,
      payload,
    });
  });
});

