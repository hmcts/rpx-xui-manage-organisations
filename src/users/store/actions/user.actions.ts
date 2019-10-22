// load login form
import { Action } from '@ngrx/store';

export const LOAD_USERS = '[User] Load Users';
export const LOAD_USERS_SUCCESS = '[User] Load Users Success';
export const LOAD_USERS_FAIL = '[User] Load Users Fail';
export const SUSPEND_USER = '[User] Suspend User';
export const SUSPEND_USER_SUCCESS = '[User] Suspend User Success';
export const SUSPEND_USER_FAIL = '[User] Suspend User Fail';


export class LoadUsers {
  readonly type = LOAD_USERS;
  constructor() { }
}

export class LoadUsersSuccess implements Action {
  readonly type = LOAD_USERS_SUCCESS;
  constructor(public payload: any) { }  // TODO add type list of users
}

export class LoadUsersFail implements Action {
  readonly type = LOAD_USERS_FAIL;
  constructor(public payload: any) { }
}

export class SuspendUser {
  readonly type = SUSPEND_USER;
  constructor(public payload: any) { }
}

export class SuspendUserSuccess implements Action {
  readonly type = SUSPEND_USER_SUCCESS;
  constructor(public payload: any) { }
}

export class SuspendUserFail implements Action {
  readonly type = SUSPEND_USER_FAIL;
  constructor(public payload: any) { }
}

export type UserActions =
  | LoadUsers
  | LoadUsersSuccess
  | LoadUsersFail
  | SuspendUser
  | SuspendUserSuccess
  | SuspendUserFail;
