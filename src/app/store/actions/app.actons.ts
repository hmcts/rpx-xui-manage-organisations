import { Action } from '@ngrx/store';

export const SET_PAGE_TITLE = '[APP] Set Page Title';
export const SET_PAGE_TITLE_ERRORS = '[APP] Set Page Title Errors';

export class SetPageTitle implements Action {
  readonly type = SET_PAGE_TITLE;
  constructor(public payload: string) {}
}

export class SetPageTitleErrors implements Action {
  readonly type = SET_PAGE_TITLE_ERRORS;
}

export type appActions =
  | SetPageTitle
  | SetPageTitleErrors;
