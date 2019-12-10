import { Action } from '@ngrx/store';

export const SET_PAGE_TITLE = '[APP] Set Page Title';
export const SET_PAGE_TITLE_ERRORS = '[APP] Set Page Title Errors';
export const SET_USER_ROLES = '[APP] Set User Roles';
export const LOAD_JURISDICTIONS_GLOBAL = '[Invite User] Load Jurisdictions Global';
export const LOAD_JURISDICTIONS_GLOBAL_SUCCESS = '[Invite User] Load Jurisdictions Global Success';
export const LOAD_JURISDICTIONS_GLOBAL_FAIL = '[Invite User] Load Jurisdictions Global Fail';
export const SET_MODAL = '[APP] Set Modal';

export const LOGOUT = '[App] Logout';
export const SIGNED_OUT = '[App] Signed Out'; // used by session management
export const SIGNED_OUT_SUCCESS = '[App] Signed Out Success'; // used by session management
export const KEEP_ALIVE = '[App] Keep Alive';

export class SetPageTitle implements Action {
  readonly type = SET_PAGE_TITLE;
  constructor(public payload: string) {}
}

export class SetPageTitleErrors implements Action {
  readonly type = SET_PAGE_TITLE_ERRORS;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class SignedOut implements Action {
  readonly type = SIGNED_OUT;
}

export class SignedOutSuccess implements Action {
  readonly type = SIGNED_OUT_SUCCESS;
}

export class KeepAlive implements Action {
  readonly type = KEEP_ALIVE;
}

export class SetUserRoles implements Action {
  readonly type = SET_USER_ROLES;
  constructor(public payload: string[]) {}
}

export class LoadJurisdictions {
  readonly type = LOAD_JURISDICTIONS_GLOBAL;
  constructor() { }
}

export class LoadJurisdictionsSuccess {
  readonly type = LOAD_JURISDICTIONS_GLOBAL_SUCCESS;
  constructor(public payload: any[]) { }
}

export class LoadJurisdictionsFail {
  readonly type = LOAD_JURISDICTIONS_GLOBAL_FAIL;
  constructor(public payload: any) { }
}

export class SetModal {
  readonly type = SET_MODAL;
  constructor(public payload: {[id: string]: {isVisible?: boolean; countdown?: string}}) { }
}


export type appActions =
  | LoadJurisdictions
  | LoadJurisdictionsFail
  | LoadJurisdictionsSuccess
  | SetPageTitle
  | SetPageTitleErrors
  | Logout
  | SetUserRoles
  | SetModal
  | SignedOut
  | KeepAlive;
