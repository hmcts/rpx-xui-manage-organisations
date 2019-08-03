import { Action } from '@ngrx/store';
export const ADD_FORM_DATA = '[Invite User] Load From Data';
export const UPDATE_ERROR_MESSAGES = '[Invite User] Update Error Messages';
export const SEND_INVITE_USER = '[Invite User] Send Invite User';
export const INVITE_USER_SUCCESS = '[Invite User] Invite User Success';
export const INVITE_USER_FAIL = '[Invite User] Invite User Fail';
export const RESET = '[Invite User] Reset';
export const LOAD_JURISDICTIONS_FOR_USER = '[Invite User] Load Jurisdictions For User';
export const LOAD_JURISDICTIONS_FOR_USER_SUCCESS = '[Invite User] Load Jurisdictions For User Success';
export const LOAD_JURISDICTIONS_FOR_USER_FAIL = '[Invite User] Load Jurisdictions For User Fail';
import { UserListApiModel } from '../../models/userform.model';

export class LoadJurisdictionsForUser {
  readonly type = LOAD_JURISDICTIONS_FOR_USER;
  constructor() { }
}

export class LoadJurisdictionsForUserSuccess {
  readonly type = LOAD_JURISDICTIONS_FOR_USER_SUCCESS;
  constructor(public payload: any[]) { }
}

export class LoadJurisdictionsForUserFail {
  readonly type = LOAD_JURISDICTIONS_FOR_USER_FAIL;
  constructor(public payload: any) { }
}

export class SendInviteUser {
  readonly type = SEND_INVITE_USER;
  constructor(public payload: UserListApiModel) { }
}

export class InviteUserSuccess implements Action {
  readonly type = INVITE_USER_SUCCESS;
  constructor(public payload: any) { }  // TODO add type list of users
}

export class InviteUserFail implements Action {
  readonly type = INVITE_USER_FAIL;
  constructor(public payload: any) { }
}
export class AddFromData {
  readonly type = ADD_FORM_DATA;
  constructor(public payload: any) { }
}

export class UpdateErrorMessages implements Action {
  readonly type = UPDATE_ERROR_MESSAGES;
  constructor(public payload: any) { }
}

export class Reset implements Action {
  readonly type = RESET;
  constructor() { }
}

export type InviteUserActions =
  | LoadJurisdictionsForUser
  | LoadJurisdictionsForUserSuccess
  | LoadJurisdictionsForUserFail
  | AddFromData
  | UpdateErrorMessages
  | SendInviteUser
  | InviteUserSuccess
  | InviteUserFail
  | Reset;
