// load login form
import {Action} from '@ngrx/store';

export const LOAD_LOGIN_FORM = '[Login] Load Login Form';
export const LOAD_LOGIN_FORM_SUCCESS = '[Login] Load Login Form Success';
export const LOAD_LOGIN_FORM_FAIL = '[Login] Load Login Form Fail';

export class LoadLoginForm {
  readonly type = LOAD_LOGIN_FORM;
}

export class LoadLoginFormSuccess  implements Action {
  readonly type = LOAD_LOGIN_FORM_SUCCESS;
  constructor(public payload: any) {}  // TODO add type
}

export class LoadLoginFormFail implements Action {
  readonly type = LOAD_LOGIN_FORM_FAIL;
  constructor(public payload: any) {}
}


export type LoginActions =
  | LoadLoginForm
  | LoadLoginFormSuccess
  | LoadLoginFormFail;
