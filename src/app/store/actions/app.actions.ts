import { Action } from '@ngrx/store';

export const SET_PAGE_TITLE = '[APP] Set Page Title';
export const SET_PAGE_TITLE_ERRORS = '[APP] Set Page Title Errors';
export const SET_USER_ROLES = '[APP] Set User Roles';

export const LOGOUT = '[App] Logout';

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

export class SetUserRoles implements Action {
  readonly type = SET_USER_ROLES;
  constructor(public payload: string[]) {}
}


export type appActions =
  | SetPageTitle
  | SetPageTitleErrors
  | Logout
  | SetUserRoles;
