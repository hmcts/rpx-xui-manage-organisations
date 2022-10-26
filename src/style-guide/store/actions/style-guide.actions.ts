// load login form
import { Action } from '@ngrx/store';

export const ADD_FORM_DATA = '[Invite User] Load From Data';
export const UPDATE_ERROR_MESSAGES = '[Invite User] Update Error Messages';

export class AddFromData {
  public readonly type = ADD_FORM_DATA;
  constructor(public payload: any) {}
}

export class UpdateErrorMessages implements Action {
  public readonly type = UPDATE_ERROR_MESSAGES;
  constructor(public payload: any) { }
}

export type StyleGuideActions =
  | AddFromData
  | UpdateErrorMessages;


