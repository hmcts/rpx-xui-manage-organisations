// load login form
import { Action } from '@ngrx/store';
import { EditUserModel } from 'src/user-profile/models/editUser.model';
import { PrdUser } from 'src/users/models/prd-users.model';

export const LOAD_USERS = '[User] Load Users';
export const LOAD_USERS_SUCCESS = '[User] Load Users Success';
export const LOAD_USERS_FAIL = '[User] Load Users Fail';
export const LOAD_ALL_USERS = '[User] Load All Users';
export const LOAD_ALL_USERS_SUCCESS = '[User] Load All Users Success';
export const LOAD_ALL_USERS_FAIL = '[User] Load All Users Fail';
export const LOAD_ALL_USERS_NO_ROLE_DATA = '[User] Load All Users No Role Data';
export const LOAD_ALL_USERS_NO_ROLE_DATA_SUCCESS = '[User] Load All Users No Role Data Success';
export const LOAD_ALL_USERS_NO_ROLE_DATA_FAIL = '[User] Load All Users No Role Data Fail';
export const EDIT_USER = '[User] Edit User';
export const EDIT_USER_SUCCESS = '[User] Edit User Success';
export const EDIT_USER_FAILURE = '[User] Edit User Failure';
export const EDIT_USER_FAILURE_RESET = '[User] Edit User Failure Reset';
export const EDIT_USER_SERVER_ERROR = '[User] Edit User Server Error';
export const REFRESH_USER = '[User] Refresh User';
export const REFRESH_USER_FAIL = '[User] Refresh User Fail';
export const LOAD_USER_DETAILS = '[UserDetails] Load User Details';
export const LOAD_USER_DETAILS_SUCCESS = '[UserDetails] Load User Details Success';
export const SUSPEND_USER = '[User] Suspend User';
export const SUSPEND_USER_SUCCESS = '[User] Suspend User Success';
export const SUSPEND_USER_FAIL = '[User] Suspend User Fail';
export const INVITE_NEW_USER = '[User] Invite New User';
export const REINVITE_PENDING_USER = '[User] Reinvite Pending User';
export const CHECK_USER_LIST_LOADED = '[User] Check user list loaded';

export class CheckUserListLoaded implements Action{
  public readonly type = CHECK_USER_LIST_LOADED;
}
export class LoadUsers {
  public readonly type = LOAD_USERS;
  constructor(public payload?: any) {}
}

export class LoadUsersSuccess implements Action {
  public readonly type = LOAD_USERS_SUCCESS;
  constructor(public payload: any) {} // TODO add type list of users
}

export class LoadUsersFail implements Action {
  public readonly type = LOAD_USERS_FAIL;
  constructor(public payload: any) {}
}

export class LoadAllUsers {
  public readonly type = LOAD_ALL_USERS;
}

export class LoadAllUsersSuccess implements Action {
  public readonly type = LOAD_ALL_USERS_SUCCESS;
}

export class LoadAllUsersFail implements Action {
  public readonly type = LOAD_ALL_USERS_FAIL;
  constructor(public payload: any) {}
}

export class LoadAllUsersNoRoleData {
  public readonly type = LOAD_ALL_USERS_NO_ROLE_DATA;
}

export class LoadAllUsersNoRoleDataSuccess implements Action {
  public readonly type = LOAD_ALL_USERS_NO_ROLE_DATA_SUCCESS;
  constructor(public payload: {users: PrdUser[]}) {}
}

export class LoadAllUsersNoRoleDataFail implements Action {
  public readonly type = LOAD_ALL_USERS_NO_ROLE_DATA_FAIL;
  constructor(public payload: any) {}
}

export class EditUser implements Action {
  public readonly type = EDIT_USER;
  constructor(public payload: EditUserModel) {}
}

export class EditUserSuccess implements Action {
  public readonly type = EDIT_USER_SUCCESS;
  constructor(public payload: any) {}
}

export class EditUserServerError implements Action {
  public readonly type = EDIT_USER_SERVER_ERROR;
  constructor(public payload: any) {}
}

export class EditUserFailure implements Action {
  public readonly type = EDIT_USER_FAILURE;
  constructor(public payload: any) {}
}
export class EditUserFailureReset implements Action {
  public readonly type = EDIT_USER_FAILURE_RESET;
}

export class LoadUserDetails {
  public readonly type = LOAD_USER_DETAILS;
  constructor(public payload: any) {}
}

export class LoadUserDetailsSuccess implements Action {
  public readonly type = LOAD_USER_DETAILS_SUCCESS;
  constructor(public payload: any) {} // TODO add type list of users
}

export class SuspendUser {
  public readonly type = SUSPEND_USER;
  constructor(public payload: any) {}
}

export class SuspendUserSuccess implements Action {
  public readonly type = SUSPEND_USER_SUCCESS;
  constructor(public payload: any) {}
}

export class SuspendUserFail implements Action {
  public readonly type = SUSPEND_USER_FAIL;
  constructor(public payload: any) {}
}

export class InviteNewUser {
  public readonly type = INVITE_NEW_USER;
}

export class ReinvitePendingUser {
  public readonly type = REINVITE_PENDING_USER;
  constructor(public payload: any) {}
}

export class RefreshUser {
  public readonly type = REFRESH_USER;
  constructor(public idamId: string) {}
}

export class RefreshUserFail {
  public readonly type = REFRESH_USER_FAIL;
  constructor(public error: Error) {}
}

export type UserActions =
  | LoadUsers
  | LoadUsersSuccess
  | LoadUsersFail
  | LoadAllUsers
  | LoadAllUsersSuccess
  | LoadAllUsersFail
  | LoadAllUsersNoRoleData
  | LoadAllUsersNoRoleDataSuccess
  | LoadAllUsersNoRoleDataFail
  | EditUser
  | EditUserFailure
  | EditUserFailureReset
  | LoadUserDetails
  | LoadUserDetailsSuccess
  | SuspendUser
  | SuspendUserSuccess
  | SuspendUserFail
  | EditUserServerError
  | ReinvitePendingUser
  | InviteNewUser
  | RefreshUser
  | CheckUserListLoaded;
