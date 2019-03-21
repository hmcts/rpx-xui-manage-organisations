import { Action } from '@ngrx/store';

export const SET_PAGE_TITLE = '[APP] Set Page Title';

export class SetPageTitle implements Action {
  readonly type = SET_PAGE_TITLE;
  constructor(public payload: string) {}
}

export type appActions = SetPageTitle;
