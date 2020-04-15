import { TCDocument } from '@hmcts/rpx-xui-common-lib';
import { Action } from '@ngrx/store';
import { GlobalError } from '../reducers/app.reducer';

export const SET_PAGE_TITLE = '[APP] Set Page Title';
export const SET_PAGE_TITLE_ERRORS = '[APP] Set Page Title Errors';
export const SET_USER_ROLES = '[APP] Set User Roles';
export const LOAD_JURISDICTIONS_GLOBAL = '[Invite User] Load Jurisdictions Global';
export const LOAD_JURISDICTIONS_GLOBAL_SUCCESS = '[Invite User] Load Jurisdictions Global Success';
export const LOAD_JURISDICTIONS_GLOBAL_FAIL = '[Invite User] Load Jurisdictions Global Fail';
export const LOAD_TERMS_CONDITIONS = '[TC] Load Terms Conditions';
export const LOAD_TERMS_CONDITIONS_SUCCESS = '[TC] Load Terms Conditions Success';
export const LOAD_TERMS_CONDITIONS_FAIL = '[TC] Load Terms Conditions Fail';
export const APP_ADD_GLOBAL_ERROR = '[APP] Add Global Error';
export const APP_ADD_GLOBAL_ERROR_SUCCESS = '[APP] Add Global Error Success';
export const APP_CLEAR_GLOBAL_ERROR = '[APP] Clear Global Error';

export const LOGOUT = '[App] Logout';

export class AddGlobalErrorSuccess implements Action {
  public readonly type = APP_ADD_GLOBAL_ERROR_SUCCESS;
  constructor() {}
}
export class AddGlobalError implements Action {
  public readonly type = APP_ADD_GLOBAL_ERROR;
  constructor(public payload: GlobalError) {}
}

export class ClearGlobalError implements Action {
  public readonly type = APP_CLEAR_GLOBAL_ERROR;
  constructor() {}
}

export class SetPageTitle implements Action {
  public readonly type = SET_PAGE_TITLE;
  constructor(public payload: string) {}
}

export class SetPageTitleErrors implements Action {
  public readonly type = SET_PAGE_TITLE_ERRORS;
}

export class Logout implements Action {
  public readonly type = LOGOUT;
}

export class SetUserRoles implements Action {
  public readonly type = SET_USER_ROLES;
  constructor(public payload: string[]) {}
}

export class LoadJurisdictions {
  public readonly type = LOAD_JURISDICTIONS_GLOBAL;
  constructor() { }
}

export class LoadJurisdictionsSuccess {
  public readonly type = LOAD_JURISDICTIONS_GLOBAL_SUCCESS;
  constructor(public payload: any[]) { }
}

export class LoadJurisdictionsFail {
  public readonly type = LOAD_JURISDICTIONS_GLOBAL_FAIL;
  constructor(public payload: any) { }
}

export class LoadTermsConditions {
  public readonly type = LOAD_TERMS_CONDITIONS;
}

export class LoadTermsConditionsSuccess {
  public readonly type = LOAD_TERMS_CONDITIONS_SUCCESS;
  constructor(public payload: TCDocument) {}
}

export class LoadTermsConditionsFail {
  public readonly type = LOAD_TERMS_CONDITIONS_FAIL;
  constructor(public payload: any) {}
}

export type appActions =
  | LoadJurisdictions
  | LoadJurisdictionsFail
  | LoadJurisdictionsSuccess
  | SetPageTitle
  | SetPageTitleErrors
  | Logout
  | SetUserRoles
  | LoadTermsConditions
  | LoadTermsConditionsSuccess
  | LoadTermsConditionsFail
  | AddGlobalError
  | ClearGlobalError
  | AddGlobalErrorSuccess;
