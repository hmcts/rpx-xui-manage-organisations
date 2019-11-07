import { Action } from '@ngrx/store';

export const ACCEPT_T_AND_C = '[T&C] Accept T&C';
export const ACCEPT_T_AND_C_SUCCESS = '[T&C] Accept T&C Success';
export const ACCEPT_T_AND_C_FAIL = '[T&C] Accept T&C Fail';


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
  | AcceptTandC
  | AcceptTandCSuccess
  | AcceptTandCFail;
