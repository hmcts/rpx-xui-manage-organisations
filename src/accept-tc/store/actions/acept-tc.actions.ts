import { Action } from '@ngrx/store';
export const LOAD_HAS_ACCEPTED_TC = '[T&C] Lad Has Accepted';
export const LOAD_HAS_ACCEPTED_TC_SUCCESS = '[T&C] Lad Has Accepted Success';
export const LOAD_HAS_ACCEPTED_TC_FAIL = '[T&C] Lad Has Accepted Fail';

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

export type AceptTcActions =
  | LoadHasAcceptedTC
  | LoadHasAcceptedTCSuccess
  | LoadHasAcceptedTCFail;
