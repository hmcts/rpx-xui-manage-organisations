import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { CaaCases } from '../../models/caa-cases.model';

export const LOAD_ASSIGNED_CASES = '[CAA CASES] Load Assigned Cases';
export const LOAD_ASSIGNED_CASES_SUCCESS = '[CAA CASES] Load Assigned Cases Success';
export const LOAD_ASSIGNED_CASES_FAILURE = '[CAA CASES] Load Assigned Cases Failure';
export const LOAD_UNASSIGNED_CASES = '[CAA CASES] Load Unassigned Cases';
export const LOAD_UNASSIGNED_CASES_SUCCESS = '[CAA CASES] Load Unassigned Cases Success';
export const LOAD_UNASSIGNED_CASES_FAILURE = '[CAA CASES] Load Unassigned Cases Failure';
export const LOAD_CASE_TYPES = '[CAA CASES] Load Case Types';
export const LOAD_CASE_TYPES_SUCCESS = '[CAA CASES] Load Case Types Success';
export const LOAD_CASE_TYPES_FAILURE = '[CAA CASES] Load Case Types Failure';
export const UPDATE_SELECTION_FOR_CASE_TYPE = '[CAA CASES] Update Selection For Case Types';

export class LoadAssignedCases implements Action {
  public readonly type = LOAD_ASSIGNED_CASES;
  constructor(public payload: {caseType: string, pageNo: number, pageSize: number, caaCasesFilterType: string | null, caaCasesFilterValue: string | null}) {}
}

export class LoadAssignedCasesSuccess implements Action {
  public readonly type = LOAD_ASSIGNED_CASES_SUCCESS;
  constructor(public payload: CaaCases) {}
}

export class LoadAssignedCasesFailure implements Action {
  public readonly type = LOAD_ASSIGNED_CASES_FAILURE;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoadUnassignedCases implements Action {
  public readonly type = LOAD_UNASSIGNED_CASES;
  constructor(public payload: {caseType: string, pageNo: number, pageSize: number, caaCasesFilterType: string | null, caaCasesFilterValue: string | null}) {}
}

export class LoadUnassignedCasesSuccess implements Action {
  public readonly type = LOAD_UNASSIGNED_CASES_SUCCESS;
  constructor(public payload: CaaCases) {}
}

export class LoadUnassignedCasesFailure implements Action {
  public readonly type = LOAD_UNASSIGNED_CASES_FAILURE;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoadCaseTypes implements Action {
  public readonly type = LOAD_CASE_TYPES;
  constructor(public payload: {caaCasesPageType: string, caaCasesFilterType: string | null, caaCasesFilterValue: string | null}) {}
}

export class LoadCaseTypesSuccess implements Action {
  public readonly type = LOAD_CASE_TYPES_SUCCESS;
  constructor(public payload: any[]) {}
}

export class LoadCaseTypesFailure implements Action {
  public readonly type = LOAD_CASE_TYPES_FAILURE;
  constructor(public payload: any) {}
}

export class UpdateSelectionForCaseType implements Action {
  public readonly type = UPDATE_SELECTION_FOR_CASE_TYPE;
  constructor(public payload: {casetype: string; cases: any [] }) {}
}

export type CaaCasesActions =
    LoadAssignedCases
  | LoadAssignedCasesSuccess
  | LoadAssignedCasesFailure
  | LoadUnassignedCases
  | LoadUnassignedCasesSuccess
  | LoadUnassignedCasesFailure
  | LoadCaseTypes
  | LoadCaseTypesSuccess
  | LoadCaseTypesFailure
  | UpdateSelectionForCaseType;
