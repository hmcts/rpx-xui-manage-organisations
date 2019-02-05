
import { SaveUser, SAVE_USER } from './userform.actions';
import { SaveUserSuccess, SAVE_USER_SUCCESS } from './userform.actions';
import { SaveUserFail, SAVE_USER_FAIL } from './userform.actions';
import { Userform } from 'src/users/userform.model';


// describe('SaveUser', () => {
//   it('should create an action', () => {
//     const payload: Userform =
//     {
//       id: 1,
//       firstname: 'Mr',
//       lastname: 'Robot',
//       emailaddress: 'yes',
//       permissions: ['a', 'b']
//     }
//     const action = new SaveUser(payload);
//     expect({ ...action }).toEqual({ type: SAVE_USER });

//   });
// });





describe('SaveUserSuccess', () => {
  it('should create an action', () => {
    const payload: Userform =
    {
      id: 1,
      firstname: 'Mr',
      lastname: 'Robot',
      emailaddress: 'yes',
      permissions: ['a', 'b']
    }
    const action = new SaveUserSuccess(payload);
    expect({ ...action }).toEqual({
      type: SAVE_USER_SUCCESS,
      payload,
    });
  });
});



describe('SaveUserFail', () => {
  it('should create an action', () => {
    const payload: any = 'fail';
    const action = new SaveUserFail(payload);
    expect({ ...action }).toEqual({
      type: SAVE_USER_FAIL,
      payload,
    });
  });
});

