import { Action } from '@ngrx/store';
export const ADD_FORM_DATA = '[Invite User] Load From Data';
export const UPDATE_ERROR_MESSAGES = '[Invite User] Update Error Messages';
export const SEND_INVITE_USER = '[Invite User] Send Invite User';
export const INVITE_USER_SUCCESS = '[Invite User] Invite User Success';
export const INVITE_USER_FAIL = '[Invite User] Invite User Fail';
export const INVITE_USER_FAIL_WITH_404 = '[Invite User] Invite User Fail With 404';
export const INVITE_USER_FAIL_WITH_400 = '[Invite User] Invite User Fail With 400';
export const INVITE_USER_FAIL_WITH_429 = '[Invite User] Invite User Fail With 429';
export const INVITE_USER_FAIL_WITH_409 = '[Invite User] Invite User Fail With 409';
export const INVITE_USER_FAIL_WITH_500 = '[Invite User] Invite User Fail With 500 Range';
export const RESET = '[Invite User] Reset';
import { UserListApiModel } from '../../models/userform.model';

export class SendInviteUser implements Action {
  public readonly type = SEND_INVITE_USER;
  constructor(public payload: UserListApiModel) { }
}

export class InviteUserSuccess implements Action {
  public readonly type = INVITE_USER_SUCCESS;
  constructor(public payload: any) { }  // TODO add type list of users
}

export class InviteUserFail implements Action {
  public readonly type = INVITE_USER_FAIL;
  constructor(public payload: any) { }
}

export class InviteUserFailWith400 implements Action {
  public readonly type = INVITE_USER_FAIL_WITH_400;
  constructor(public payload: any) { }
}

export class InviteUserFailWith404 implements Action {
  public readonly type = INVITE_USER_FAIL_WITH_404;
  constructor(public payload: any) { }
}

export class InviteUserFailWith429 implements Action {
  public readonly type = INVITE_USER_FAIL_WITH_429;
  constructor(public payload: any) { }
}

export class InviteUserFailWith409 implements Action {
  public readonly type = INVITE_USER_FAIL_WITH_409;
  constructor(public payload: any) { }
}

export class InviteUserFailWith500 implements Action {
  public readonly type = INVITE_USER_FAIL_WITH_500;
  constructor(public payload: any) { }
}
export class AddFromData {
  public readonly type = ADD_FORM_DATA;
  constructor(public payload: any) { }
}

export class UpdateErrorMessages implements Action {
  public readonly type = UPDATE_ERROR_MESSAGES;
  constructor(public payload: any) { }
}

export class Reset implements Action {
  public readonly type = RESET;
  constructor() { }
}

export type InviteUserActions =
  | AddFromData
  | UpdateErrorMessages
  | SendInviteUser
  | InviteUserSuccess
  | InviteUserFail
  | InviteUserFailWith400
  | InviteUserFailWith404
  | InviteUserFailWith429
  | InviteUserFailWith500
  | InviteUserFailWith409
  | Reset;
