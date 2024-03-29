import { Action } from '@ngrx/store';

export const LOAD_SINGLE_FEE_ACCOUNT = '[Single Fee Account] Load Single Fee Account';
export const LOAD_SINGLE_FEE_ACCOUNT_SUCCESS = '[Single Fee Account] Load Single Fee Account Success';
export const LOAD_SINGLE_FEE_ACCOUNT_FAIL = '[Single Fee Account] Load Single Fee Account Fail';
export const RESET_SINGLE_FEE_ACCOUNT = '[Single Fee Account] Reset Single Fee Account';

export class LoadSingleFeeAccount {
  public readonly type = LOAD_SINGLE_FEE_ACCOUNT;
  constructor(public payload: any) {}
}

export class LoadSingleFeeAccountSuccess implements Action {
  public readonly type = LOAD_SINGLE_FEE_ACCOUNT_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadSingleFeeAccountFail implements Action {
  public readonly type = LOAD_SINGLE_FEE_ACCOUNT_FAIL;
  constructor(public payload: any) {}
}

export const LOAD_SINGLE_FEE_ACCOUNT_TRANSACTIONS = '[Single Account Transactions] Load ';
export const LOAD_SINGLE_FEE_ACCOUNT_TRANSACTIONS_SUCCESS = '[Single Account Transactions] Load Success';
export const LOAD_SINGLE_FEE_ACCOUNT_TRANSACTIONS_FAIL = '[Single Fee Account] Load Fail';

export class LoadSingleFeeAccountTransactions {
  public readonly type = LOAD_SINGLE_FEE_ACCOUNT_TRANSACTIONS;
  constructor(public payload: any) {}
}

export class LoadSingleFeeAccountTransactionsSuccess implements Action {
  public readonly type = LOAD_SINGLE_FEE_ACCOUNT_TRANSACTIONS_SUCCESS;
  constructor(public payload: any[]) {}
}

export class LoadSingleFeeAccountTransactionsFail implements Action {
  public readonly type = LOAD_SINGLE_FEE_ACCOUNT_TRANSACTIONS_FAIL;
  constructor(public payload: any) {}
}

export class ResetSingleFeeAccount implements Action {
  public readonly type = RESET_SINGLE_FEE_ACCOUNT;
  constructor(public payload: any) {}
}

export type SingleFeeAccountActions =
  | LoadSingleFeeAccount
  | LoadSingleFeeAccountSuccess
  | LoadSingleFeeAccountFail
  | ResetSingleFeeAccount
  | LoadSingleFeeAccountTransactions
  | LoadSingleFeeAccountTransactionsSuccess
  | LoadSingleFeeAccountTransactionsFail;

