import {Action} from '@ngrx/store';

export const LOAD_FEE_ACCOUNT_SUMMARY = '[Fee Account Summary] Load Fee Account Summary';
export const LOAD_FEE_ACCOUNT_SUMMARY_SUCCESS = '[Fee Account Summary] Load Fee Account Summary Success';
export const LOAD_FEE_ACCOUNT_SUMMARY_FAIL = '[Fee Account Summary] Load Fee Account Summary Fail';
export const RESET_FEE_ACCOUNT_SUMMARY = '[Fee Account Summary] Reset Fee Account Summary';

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

export class ResetFeeAccountSummary implements Action {
  readonly type = RESET_FEE_ACCOUNT_SUMMARY;
  constructor(public payload: any) {}
}

export type FeeAccountSummaryActions =
  | LoadFeeAccountSummary
  | LoadFeeAccountSummarySuccess
  | LoadFeeAccountSummaryFail
  | ResetFeeAccountSummary;

