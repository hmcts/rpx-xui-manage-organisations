import {Action} from '@ngrx/store';

export const LOAD_SINGLE_FEE_ACCOUNT = '[Single Fee Account] Load Single Fee Account';
export const LOAD_SINGLE_FEE_ACCOUNT_SUCCESS = '[Single Fee Account] Load Single Fee Account Success';
export const LOAD_SINGLE_FEE_ACCOUNT_FAIL = '[Single Fee Account] Load Single Fee Account Fail';
export const RESET_SINGLE_FEE_ACCOUNT = '[Single Fee Account] Reset Single Fee Account';

export class LoadSingleFeeAccount {
  readonly type = LOAD_SINGLE_FEE_ACCOUNT;
  constructor(public payload: any) {}
}

export class LoadSingleFeeAccountSuccess  implements Action {
  readonly type = LOAD_SINGLE_FEE_ACCOUNT_SUCCESS;
  constructor(public payload: any[]) {}
}

export class LoadSingleFeeAccountFail implements Action {
  readonly type = LOAD_SINGLE_FEE_ACCOUNT_FAIL;
  constructor(public payload: any) {}
}

export class ResetSingleFeeAccount implements Action {
  readonly type = RESET_SINGLE_FEE_ACCOUNT;
  constructor(public payload: any) {}
}

export type SingleFeeAccountActions =
  | LoadSingleFeeAccount
  | LoadSingleFeeAccountSuccess
  | LoadSingleFeeAccountFail
  | ResetSingleFeeAccount;

