import { Action } from '@ngrx/store';

export const LOAD_FEE_ACCOUNTS = '[Fee Accounts] Load Fee Accounts';
export const LOAD_FEE_ACCOUNTS_SUCCESS = '[Fee Accounts] Load Fee Accounts Success';
export const LOAD_FEE_ACCOUNTS_FAIL = '[Fee Accounts] Load Fee Accounts Fail';
export const LOAD_FEE_ONE_OR_MORE_ACCOUNTS_FAIL = '[Fee Accounts] Load Fee One or more Accounts Fail';
export const LOAD_FEE_RESET_STATE = '[Fee Accounts] Reset State';

export class LoadFeeAccounts {
  constructor(public paymentAccounts: string[]) {}

  public readonly type = LOAD_FEE_ACCOUNTS;
}

export class LoadFeeAccountsSuccess implements Action {
  public readonly type = LOAD_FEE_ACCOUNTS_SUCCESS;
  constructor(public payload: any[]) {} // TODO add type list of users
}

export class LoadFeeAccountsFail implements Action {
  public readonly type = LOAD_FEE_ACCOUNTS_FAIL;
  constructor(public payload: any) {}
}

export class LoadFeeOneOrMoreAccountsFail implements Action {
  public readonly type = LOAD_FEE_ONE_OR_MORE_ACCOUNTS_FAIL;
  constructor(public payload: any) {}
}

export class LoadFeeAccountResetState implements Action {
  public readonly type = LOAD_FEE_RESET_STATE;
}

export type FeeAccountsActions =
  | LoadFeeAccounts
  | LoadFeeAccountsSuccess
  | LoadFeeAccountsFail
  | LoadFeeOneOrMoreAccountsFail
  | LoadFeeAccountResetState;

