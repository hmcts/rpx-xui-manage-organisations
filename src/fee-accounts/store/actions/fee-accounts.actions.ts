import {Action} from '@ngrx/store';

export const LOAD_FEE_ACCOUNTS = '[Fee Accounts] Load Fee Accounts';
export const LOAD_FEE_ACCOUNTS_SUCCESS = '[Fee Accounts] Load Fee Accounts Success';
export const LOAD_FEE_ACCOUNTS_FAIL = '[Fee Accounts] Load Fee Accounts Fail';

export class LoadFeeAccounts {
  readonly type = LOAD_FEE_ACCOUNTS;
}

export class LoadFeeAccountsSuccess  implements Action {
  readonly type = LOAD_FEE_ACCOUNTS_SUCCESS;
  constructor(public payload: any[]) {}  // TODO add type list of users
}

export class LoadFeeAccountsFail implements Action {
  readonly type = LOAD_FEE_ACCOUNTS_FAIL;
  constructor(public payload: any) {}
}

export type FeeAccountsActions =
  | LoadFeeAccounts
  | LoadFeeAccountsSuccess
  | LoadFeeAccountsFail;

