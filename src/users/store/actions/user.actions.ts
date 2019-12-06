// load login form
import { Action } from '@ngrx/store';
import { UserList } from 'src/users/models/user-list.model';
import { User } from 'src/users/models/user.model';

export const LOAD_USERS = '[User] Load Users';
export const LOAD_USERS_SUCCESS = '[User] Load Users Success';
export const LOAD_USERS_FAIL = '[User] Load Users Fail';

export const LOAD_SINGLE_USER = '[User] Load Single User';
export const LOAD_SINGLE_USER_SUCCESS = '[User] Load Single User Success';
export const LOAD_SINGLE_USER_FAIL = '[User] Load Single User Fail';

export class LoadUsers {
  readonly type = LOAD_USERS;
  constructor() {}
}

export class LoadUsersSuccess implements Action {
  readonly type = LOAD_USERS_SUCCESS;
  constructor(public payload: UserList) { }
}

export class LoadUsersFail implements Action {
  readonly type = LOAD_USERS_FAIL;
  constructor(public payload: any) { }
}

export class LoadSingleUser {
  readonly type = LOAD_SINGLE_USER;
  constructor(public payload: string) {}
}

export class LoadSingleUserSuccess implements Action {
  readonly type = LOAD_SINGLE_USER_SUCCESS;
  constructor(public payload: User) { }
}

export class LoadSingleUserFail implements Action {
  readonly type = LOAD_SINGLE_USER_FAIL;
  constructor(public payload: any) { }
}

export type UserActions =
  | LoadUsers
  | LoadUsersSuccess
  | LoadUsersFail
  | LoadSingleUser
  | LoadSingleUserSuccess
  | LoadSingleUserFail;
