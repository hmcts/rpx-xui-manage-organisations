import { Action } from '@ngrx/store';
import { CaaCases } from '../../models/caa-cases.model';

export const LOAD_ASSIGNED_CASES = '[CAA CASES] Load Assinged Cases';
export const LOAD_ASSIGNED_CASES_SUCCESS = '[CAA CASES] Load Assinged Cases Success';
export const LOAD_ASSIGNED_CASES_FAILURE = '[CAA CASES] Load Assinged Cases Failure';
export const LOAD_ASSIGNED_CASE_TYPES = '[CAA CASES] Load Assinged Case Types';
export const LOAD_ASSIGNED_CASE_TYPES_SUCCESS = '[CAA CASES] Load Assinged Case Types Success';
export const LOAD_ASSIGNED_CASE_TYPES_FAILURE = '[CAA CASES] Load Assinged Case Types Failure';
export const LOAD_UNASSIGNED_CASES = '[CAA CASES] Load Unassinged Cases';
export const LOAD_UNASSIGNED_CASES_SUCCESS = '[CAA CASES] Load Unassinged Cases Success';
export const LOAD_UNASSIGNED_CASES_FAILURE = '[CAA CASES] Load Unassinged Cases Failure';
export const LOAD_UNASSIGNED_CASE_TYPES = '[CAA CASES] Load Unassinged Case Types';
export const LOAD_UNASSIGNED_CASE_TYPES_SUCCESS = '[CAA CASES] Load Unassinged Case Types Success';
export const LOAD_UNASSIGNED_CASE_TYPES_FAILURE = '[CAA CASES] Load Unassinged Case Types Failure';
export const UPDATE_SELECTION_FOR_CASE_TYPE = '[CAA CASES] Update Selection For Case Types';

export class LoadAssignedCases implements Action {
	public readonly type = LOAD_ASSIGNED_CASES;
	constructor(public payload: {caseType: string, pageNo: number, pageSize: number}) {}
}

export class LoadAssignedCasesSuccess implements Action {
	public readonly type = LOAD_ASSIGNED_CASES_SUCCESS;
	constructor(public payload: CaaCases) {}
}

export class LoadAssignedCasesFailure implements Action {
	public readonly type = LOAD_ASSIGNED_CASES_FAILURE;
	constructor(public payload: any) {}
}

export class LoadAssignedCaseTypes implements Action {
	public readonly type = LOAD_ASSIGNED_CASE_TYPES;
	constructor() {}
}

export class LoadAssignedCaseTypesSuccess implements Action {
	public readonly type = LOAD_ASSIGNED_CASE_TYPES_SUCCESS;
	constructor(public payload: any[]) {}
}

export class LoadAssignedCaseTypesFailure implements Action {
	public readonly type = LOAD_ASSIGNED_CASE_TYPES_FAILURE;
	constructor(public payload: any) {}
}

export class LoadUnassignedCases implements Action {
    public readonly type = LOAD_UNASSIGNED_CASES;
    constructor(public payload: {caseType: string, pageNo: number, pageSize: number}) {}
}

export class LoadUnassignedCasesSuccess implements Action {
    public readonly type = LOAD_UNASSIGNED_CASES_SUCCESS;
    constructor(public payload: CaaCases) {}
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

export class UpdateSelectionForCaseType implements Action {
	public readonly type = UPDATE_SELECTION_FOR_CASE_TYPE;
	constructor(public payload: {casetype: string; cases: any [] }) {}
}

export type CaaCasesActions =
		LoadAssignedCases
	| LoadAssignedCasesSuccess
	| LoadAssignedCasesFailure
	| LoadAssignedCaseTypes
	| LoadAssignedCaseTypesSuccess
	| LoadAssignedCaseTypesFailure
	| LoadUnassignedCases
  | LoadUnassignedCasesSuccess
  | LoadUnassignedCasesFailure
  | LoadUnassignedCaseTypes
  | LoadUnassignedCaseTypesSuccess
  | LoadUnassignedCaseTypesFailure
  | UpdateSelectionForCaseType;
