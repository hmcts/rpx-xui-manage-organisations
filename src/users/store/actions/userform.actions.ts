// load login form
import { Action } from '@ngrx/store';
import { Userform } from 'src/users/userform.model';

export const SAVE_USER = '[SaveUser] Save Users';
export const SAVE_USER_SUCCESS = '[SaveUser] Save Users Success';
export const SAVE_USER_FAIL = '[SaveUser] Save Users Fail';

export class SaveUser implements Action {
  readonly type = SAVE_USER;
  constructor(public payload: any) { }
}

export class SaveUserSuccess implements Action {
  readonly type = SAVE_USER_SUCCESS;
  constructor(public payload: any) { }  // TODO add type list of users
}

export class SaveUserFail implements Action {
  readonly type = SAVE_USER_FAIL;
  constructor(public payload: any) { }
}

export type UserformActions =
  | SaveUser
  | SaveUserSuccess
  | SaveUserFail;

