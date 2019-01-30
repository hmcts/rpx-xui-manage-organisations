// load login form
import { Action } from '@ngrx/store';
import { LoggedUser } from 'src/login/loggedUser.model';

export const LOGIN_USER = '[Login] Login User';
export const LOGIN_USER_SUCCESS = '[Login] Login User Success';
export const LOGIN_USER_FAIL = '[Login] Login User Fail';

export class LoginUser {
  readonly type = LOGIN_USER;
  constructor(public payload: { userName: string, password: string }) { } // todo extract this into model
}

export class LoginUserSuccess implements Action {
  readonly type = LOGIN_USER_SUCCESS;
  constructor(public payload: LoggedUser) { }  // TODO add type
}

export class LoginUserFail implements Action {
  readonly type = LOGIN_USER_FAIL;
  constructor(public payload: any) { }
}

export type LoginActions =
  | LoginUser
  | LoginUserSuccess
  | LoginUserFail;

