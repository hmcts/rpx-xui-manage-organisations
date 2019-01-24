// load login form
import {Action} from '@ngrx/store';

export const LOGIN_USER = '[Login] Login User';
export const LOGIN_USER_SUCCESS = '[Login]Login User Success';
export const LOGIN_USER_FAIL = '[Login] Login User Fail';

export class LoginUser {
  readonly type = LOGIN_USER;
  constructor(public palaoud: {userName: string, password: string}) {} // todo extract this into model
}

export class LoginUserSuccess  implements Action {
  readonly type = LOGIN_USER_SUCCESS;
  constructor(public payload: any) {}  // TODO add type
}

export class LoginUserFail implements Action {
  readonly type = LOGIN_USER_FAIL;
  constructor(public payload: any) {}
}


export type LoginActions =
  | LoginUser
  | LoginUserSuccess
  | LoginUserFail;
