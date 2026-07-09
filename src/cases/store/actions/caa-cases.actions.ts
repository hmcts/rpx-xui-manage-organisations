import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { CaaCases } from '../../models/caa-cases.model';

export const LOAD_CASES = '[CAA CASES] Load Cases';
export const LOAD_CASES_SUCCESS = '[CAA CASES] Load Cases Success';
export const LOAD_CASES_FAILURE = '[CAA CASES] Load Cases Failure';
export const LOAD_CASE_TYPES = '[CAA CASES] Load Case Types';
export const LOAD_CASE_TYPES_SUCCESS = '[CAA CASES] Load Case Types Success';
export const LOAD_CASE_TYPES_FAILURE = '[CAA CASES] Load Case Types Failure';
export const UPDATE_SELECTION_FOR_CASE_TYPE = '[CAA CASES] Update Selection For Case Types';

export class LoadCases implements Action {
  public readonly type = LOAD_CASES;
  constructor(public payload: {caseType: string, pageNo: number, pageSize: number, caaCasesPage: string, caaCasesFilterType: string | null, caaCasesFilterValue: string | null}) {}
}

export class LoadCasesSuccess implements Action {
  public readonly type = LOAD_CASES_SUCCESS;
  constructor(public payload: CaaCases) {}
}

export class LoadCasesFailure implements Action {
  public readonly type = LOAD_CASES_FAILURE;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoadCaseTypes implements Action {
  public readonly type = LOAD_CASE_TYPES;
  constructor(public payload: {caaCasesPageType: string, caaCasesFilterType: string | null, caaCasesFilterValue: string | null}) {}
}

export class LoadCaseTypesSuccess implements Action {
  public readonly type = LOAD_CASE_TYPES_SUCCESS;
  constructor(public payload: any[], public suppData: any[]) {}
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
    LoadCases
  | LoadCasesSuccess
  | LoadCasesFailure
  | LoadCaseTypes
  | LoadCaseTypesSuccess
  | LoadCaseTypesFailure
  | UpdateSelectionForCaseType;
