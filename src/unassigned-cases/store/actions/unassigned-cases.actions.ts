import { Action } from '@ngrx/store';

export const LOAD_UNASSIGNED_CASES = '[Unassigned Cases] Load Unassinged Cases';
export const LOAD_UNASSIGNED_CASES_SUCCESS = '[Unassigned Cases] Load Unassinged Cases Success';
export const LOAD_UNASSIGNED_CASES_FAILURE = '[Unassigned Cases] Load Unassinged Cases Failure';
export const LOAD_UNASSIGNED_CASE_TYPES = '[Unassigned Cases] Load Unassinged Case Types';
export const LOAD_UNASSIGNED_CASE_TYPES_SUCCESS = '[Unassigned Cases] Load Unassinged Case Types Success';
export const LOAD_UNASSIGNED_CASE_TYPES_FAILURE = '[Unassigned Cases] Load Unassinged Case Types Failure';
export const UPDATE_SELECTION_FOR_CASE_TYPE = '[Unassigned Cases] Update Selection For Case Types';

export class LoadUnassignedCases implements Action {
    public readonly type = LOAD_UNASSIGNED_CASES;
    constructor(public caseType: string) {}
}

export class LoadUnassignedCasesSuccess implements Action {
    public readonly type = LOAD_UNASSIGNED_CASES_SUCCESS;
    constructor(public payload: any[]) {}
}

export class UpdateSelectionForCaseType implements Action {
    public readonly type = UPDATE_SELECTION_FOR_CASE_TYPE;
    constructor(public payload: {casetype: string; cases: any [] }) {}
}

export class LoadUnassignedCasesFailure implements Action {
    public readonly type = LOAD_UNASSIGNED_CASES_FAILURE;
    constructor(public payload: any) {}
}

export class LoadUnassignedCaseTypes implements Action {
    public readonly type = LOAD_UNASSIGNED_CASE_TYPES;
    constructor() {}
}

export class LoadUnassignedCaseTypesSuccess implements Action {
    public readonly type = LOAD_UNASSIGNED_CASE_TYPES_SUCCESS;
    constructor(public payload: any[]) {}
}

export class LoadUnassignedCaseTypesFailure implements Action {
    public readonly type = LOAD_UNASSIGNED_CASE_TYPES_FAILURE;
    constructor(public payload: any) {}
}

export type UnassignedCasesActions =
    LoadUnassignedCases
  | LoadUnassignedCasesSuccess
  | LoadUnassignedCasesFailure
  | LoadUnassignedCaseTypes
  | LoadUnassignedCaseTypesSuccess
  | LoadUnassignedCaseTypesFailure
  | UpdateSelectionForCaseType;
