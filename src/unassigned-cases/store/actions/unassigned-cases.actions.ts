import { Action } from '@ngrx/store';

export const LOAD_UNASSIGNED_CASES = '[Unassigned Cases] Load Fee Accounts';
export const LOAD_UNASSIGNED_CASES_SUCCESS = '[Unassigned Cases] Load Fee Accounts Success';
export const LOAD_UNASSIGNED_CASES_FAILURE = '[Unassigned Cases] Load Fee Accounts Failure';

export class LoadUnassignedCases implements Action {
    public readonly type = LOAD_UNASSIGNED_CASES;
    constructor() {}
}

export class LoadUnassignedCasesSuccess implements Action {
    public readonly type = LOAD_UNASSIGNED_CASES_SUCCESS;
    constructor(public payload: any[]) {}
}

export class LoadUnassignedCasesFailure implements Action {
    public readonly type = LOAD_UNASSIGNED_CASES_FAILURE;
    constructor(public payload: any) {}
}

export type UnassignedCasesActions =
    LoadUnassignedCases
  | LoadUnassignedCasesSuccess
  | LoadUnassignedCasesFailure;
