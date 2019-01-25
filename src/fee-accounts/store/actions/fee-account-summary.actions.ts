import {Action} from '@ngrx/store';

export const LOAD_FEE_ACCOUNT_SUMMARY = '[Fee Account Summary] Load Fee Account Summary';
export const LOAD_FEE_ACCOUNT_SUMMARY_SUCCESS = '[Fee Account Summary] Load Fee Account Summary Success';
export const LOAD_FEE_ACCOUNT_SUMMARY_FAIL = '[Fee Account Summary] Load Fee Account Summary Fail';

export class LoadFeeAccountSummary {
  readonly type = LOAD_FEE_ACCOUNT_SUMMARY;
  constructor(public payload: any) {}
}

export class LoadFeeAccountSummarySuccess  implements Action {
  readonly type = LOAD_FEE_ACCOUNT_SUMMARY_SUCCESS;
  constructor(public payload: any[]) {}
}

export class LoadFeeAccountSummaryFail implements Action {
  readonly type = LOAD_FEE_ACCOUNT_SUMMARY_FAIL;
  constructor(public payload: any) {}
}

export type FeeAccountSummaryActions =
  | LoadFeeAccountSummary
  | LoadFeeAccountSummarySuccess
  | LoadFeeAccountSummaryFail;

