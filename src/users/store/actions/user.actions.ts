// load login form
import { Action } from '@ngrx/store';
import { UserList } from 'src/users/models/user-list.model';
import { User } from 'src/users/models/user.model';

export const LOAD_USERS = '[User] Load Users';
export const LOAD_USERS_SUCCESS = '[User] Load Users Success';
export const LOAD_USERS_FAIL = '[User] Load Users Fail';

export const LOAD_SELECTED_USER = '[User] Load Selected User';
export const LOAD_SELECTED_USER_SUCCESS = '[User] Load Selected User Success';
export const LOAD_SELECTED_USER_FAIL = '[User] Load Selected User Fail';

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

export class LoadSelectedUser {
  readonly type = LOAD_SELECTED_USER;
  constructor(public payload: string) {}
}

export class LoadSelectedUserSuccess implements Action {
  readonly type = LOAD_SELECTED_USER_SUCCESS;
  constructor(public payload: User) { }
}

export class LoadSelectedUserFail implements Action {
  readonly type = LOAD_SELECTED_USER_FAIL;
  constructor(public payload: any) { }
}

export type UserActions =
  | LoadUsers
  | LoadUsersSuccess
  | LoadUsersFail
  | LoadSelectedUser
  | LoadSelectedUserSuccess
  | LoadSelectedUserFail;
