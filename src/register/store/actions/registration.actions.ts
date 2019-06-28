
import {Action} from '@ngrx/store';


export const LOAD_PAGE_ITEMS = '[Registration] LoadPageItems';
export const LOAD_PAGE_ITEMS_SUCCESS = '[Registration] LoadPageItems Success';
export const LOAD_PAGE_ITEMS_FAIL = '[Registration] LoadPageItems Fail';

export const SAVE_FORM_DATA = '[Registration] Save Form Data';

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

export type RegistrationActions =
  | LoadPageItems
  | LoadPageItemsSuccess
  | LoadPageItemsFail
  | SaveFormData
  | SubmitFormData
  | SubmitFormDataSuccess
  | SubmitFormDataFail;
