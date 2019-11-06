import { Action } from '@ngrx/store';
export const LOAD_HAS_ACCEPTED_TC = '[T&C] Lad Has Accepted';
export const LOAD_HAS_ACCEPTED_TC_SUCCESS = '[T&C] Lad Has Accepted Success';
export const LOAD_HAS_ACCEPTED_TC_FAIL = '[T&C] Lad Has Accepted Fail';

export const ACCEPT_T_AND_C = '[T&C] Accept T&C';
export const ACCEPT_T_AND_C_SUCCESS = '[T&C] Accept T&C Success';
export const ACCEPT_T_AND_C_FAIL = '[T&C] Accept T&C Fail';

export class LoadHasAcceptedTC implements Action {
  readonly type = LOAD_HAS_ACCEPTED_TC;
}

export class LoadHasAcceptedTCSuccess implements Action {
  readonly type = LOAD_HAS_ACCEPTED_TC_SUCCESS;
  constructor(public payload: boolean) {}
}

export class LoadHasAcceptedTCFail implements Action {
  readonly type = LOAD_HAS_ACCEPTED_TC_FAIL;
  constructor(public payload: boolean) {}
}

export class AcceptTandC implements Action {
  readonly type = ACCEPT_T_AND_C;
  constructor(public payload: any) {}
}

export class AcceptTandCSuccess implements Action {
  readonly type = ACCEPT_T_AND_C_SUCCESS;
  constructor(public payload: boolean) {}
}

export class AcceptTandCFail implements Action {
  readonly type = ACCEPT_T_AND_C_FAIL;
  constructor(public payload: boolean) {}
}

export type AceptTcActions =
  | LoadHasAcceptedTC
  | LoadHasAcceptedTCSuccess
  | LoadHasAcceptedTCFail;
