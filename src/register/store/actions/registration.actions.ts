
import {Action} from '@ngrx/store';

export const LOAD_PAGE_ITEMS = '[Registration] LoadPageItems';
export const LOAD_PAGE_ITEMS_SUCCESS = '[Registration] LoadPageItems Success';
export const LOAD_PAGE_ITEMS_FAIL = '[Registration] LoadPageItems Fail';

export const SAVE_FORM_DATA = '[Registration] Save Form Data';

export const RESET_ERROR_MESSAGE = '[Registration] ResetErrorMessage';
export const RESET_NEXT_URL = '[Registration] Reset Next Url';

export class LoadPageItems implements Action {
  readonly type = LOAD_PAGE_ITEMS;
  constructor(public payload: string) {}
}

export class LoadPageItemsSuccess implements Action {
  readonly type = LOAD_PAGE_ITEMS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadPageItemsFail implements Action {
  readonly type = LOAD_PAGE_ITEMS_FAIL;
  constructor(public payload: any) {
  }
}

export class SaveFormData implements Action {
  readonly type = SAVE_FORM_DATA;
  constructor(public payload: {value: any, pageId: string}) {}
}

export const SUBMIT_FORM_DATA = '[Registration] Submit Form Data';
export const SUBMIT_FORM_DATA_SUCCESS = '[Registration] Submit Form Data Success';
export const SUBMIT_FORM_DATA_FAIL = '[Registration] Submit Form Data Fail';

export class SubmitFormData implements Action {
  readonly type = SUBMIT_FORM_DATA;
  constructor(public payload: object) {}
}

export class SubmitFormDataSuccess implements Action {
  readonly type = SUBMIT_FORM_DATA_SUCCESS;
}

export class SubmitFormDataFail implements Action {
  readonly type = SUBMIT_FORM_DATA_FAIL;
  constructor(public payload: any) {
  }
}

export class ResetErrorMessage implements Action {
  readonly type = RESET_ERROR_MESSAGE;
  constructor(public payload: any) {}
}

/**
 * Reset Next Url
 *
 * We reset the nextUrl on the Store when a User clicks the Back Button.
 *
 * We do this as we subscribe to the nextUrl state within register.component.ts. When the nextUrl changes a Go action is dispatched, which
 * navigates the User to the next url (page).
 *
 * When the User clicks the Back button we need to reset the nextUrl state, otherwise the state will remain the same when they click
 * Continue, and therefore the register.component.ts's $nextUrlSubscription will never be trigger.
 *
 * @see register.component.ts
 */
export class ResetNextUrl implements Action {
  readonly type = RESET_NEXT_URL;
  constructor() {
  }
}

export type RegistrationActions =
  | LoadPageItems
  | LoadPageItemsSuccess
  | LoadPageItemsFail
  | SaveFormData
  | SubmitFormData
  | SubmitFormDataSuccess
  | SubmitFormDataFail
  | ResetErrorMessage
  | ResetNextUrl;
