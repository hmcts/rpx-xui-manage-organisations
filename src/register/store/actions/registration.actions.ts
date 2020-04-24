
import {Action} from '@ngrx/store';

export const LOAD_PAGE_ITEMS = '[Registration] LoadPageItems';
export const LOAD_PAGE_ITEMS_SUCCESS = '[Registration] LoadPageItems Success';
export const LOAD_PAGE_ITEMS_FAIL = '[Registration] LoadPageItems Fail';

export const SAVE_FORM_DATA = '[Registration] Save Form Data';

export const RESET_ERROR_MESSAGE = '[Registration] ResetErrorMessage';

export const RESET_ERROR_MESSAGE_CODE = '[Registration] ResetErrorMessageCode';

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

export class ResetErrorMessageCode implements Action {
  readonly type = RESET_ERROR_MESSAGE_CODE;
  constructor(public payload: any) {}
}

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
  | ResetErrorMessageCode
  | ResetNextUrl;
