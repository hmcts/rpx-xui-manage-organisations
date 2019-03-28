// load login form
import { Action } from '@ngrx/store';
import {UserListApiModel} from '../../models/userform.model';

export const LOAD_USERS = '[User] Load Users';
export const LOAD_USERS_SUCCESS = '[User] Load Users Success';
export const LOAD_USERS_FAIL = '[User] Load Users Fail';


export class LoadUsers {
  readonly type = LOAD_USERS;
  constructor() {}
}

export class LoadUsersSuccess implements Action {
  readonly type = LOAD_USERS_SUCCESS;
  constructor(public payload: any[]) { }  // TODO add type list of users
}

export class LoadUsersFail implements Action {
  readonly type = LOAD_USERS_FAIL;
  constructor(public payload: any) { }
}

export const INVITE_USER = '[User] Invite Users';
export const INVITE_USER_SUCCESS = '[User] Invite Users Success';
export const INVITE_USER_FAIL = '[User] Invite Users Fail';



export class InviteUser {
  readonly type = INVITE_USER;
  constructor(public payload: UserListApiModel) {}
}

export class InviteUserSuccess implements Action {
  readonly type = INVITE_USER_SUCCESS;
  constructor(public payload: any) { }  // TODO add type list of users
}

export class InviteUserFail implements Action {
  readonly type = INVITE_USER_FAIL;
  constructor(public payload: any) { }
}


export type UserActions =
  | LoadUsers
  | LoadUsersSuccess
  | LoadUsersFail
  | InviteUser
  | InviteUserSuccess
  | InviteUserFail;
