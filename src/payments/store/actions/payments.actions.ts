// load payments form
import {Action} from '@ngrx/store';

export const LOAD_PAYMENTS_FORM = '[Payments] Load Payments Form';
export const LOAD_PAYMENTS_FORM_SUCCESS = '[Payments] Load Payments Form Success';
export const LOAD_PAYMENTS_FORM_FAIL = '[Payments] Load Payments Form Fail';

export class LoadPaymentsForm {
  readonly type = LOAD_PAYMENTS_FORM;
}

export class LoadPaymentsFormSuccess  implements Action {
  readonly type = LOAD_PAYMENTS_FORM_SUCCESS;
  constructor(public payload: any) {}  // TODO add type
}

export class LoadPaymentsFormFail implements Action {
  readonly type = LOAD_PAYMENTS_FORM_FAIL;
  constructor(public payload: any) {}
}


export type PaymentsActions =
  | LoadPaymentsForm
  | LoadPaymentsFormSuccess
  | LoadPaymentsFormFail;
