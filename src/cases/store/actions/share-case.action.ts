import { NavigationExtras } from '@angular/router';
import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model';
import { UserDetails } from '@hmcts/rpx-xui-common-lib/lib/models/user-details.model';
import { Action } from '@ngrx/store';

// Assigned cases actions
export const NAVIGATE_TO_SHARE_ASSIGNED_CASES = '[ShareCase] Navigate To Share Assigned Cases';
export const LOAD_SHARE_ASSIGNED_CASES = '[ShareCase] Load Share Assigned Cases';
export const LOAD_SHARE_ASSIGNED_CASES_SUCCESS = '[ShareCase] Load Share Assigned Cases Success';
export const LOAD_SHARE_ASSIGNED_CASES_FAILURE = '[ShareCase] Load Share Assigned Cases Failure';
export const ADD_SHARE_ASSIGNED_CASES = '[ShareCase] Add Share Assigned Cases';
export const ADD_SHARE_ASSIGNED_CASES_GO = '[Router] Add Share Assigned Case Go';
export const DELETE_A_SHARE_ASSIGNED_CASE = '[ShareCase] Delete A Share Assigned Case';
export const ASSIGN_USERS_TO_ASSIGNED_CASE = '[ShareCase] Assign Users to Assigned Case';
export const ASSIGN_USERS_TO_ASSIGNED_CASE_SUCCESS = '[ShareCase] Assign Users to Assigned Case Success';
export const RESET_ASSIGNED_CASE_SELECTION = '[ShareCase] Reset Assigned Case Selection';

// Unassigned cases actions
export const NAVIGATE_TO_SHARE_UNASSIGNED_CASES = '[ShareCase] Navigate To Share Unassigned Cases';
export const LOAD_SHARE_UNASSIGNED_CASES = '[ShareCase] Load Share Unassigned Cases';
export const LOAD_SHARE_UNASSIGNED_CASES_SUCCESS = '[ShareCase] Load Share Unassigned Cases Success';
export const LOAD_SHARE_UNASSIGNED_CASES_FAILURE = '[ShareCase] Load Share Unassigned Cases Failure';
export const ADD_SHARE_UNASSIGNED_CASES = '[ShareCase] Add Share Unassigned Cases';
export const ADD_SHARE_UNASSIGNED_CASES_GO = '[Router] Add Share Unassigned Case Go';
export const DELETE_A_SHARE_UNASSIGNED_CASE = '[ShareCase] Delete A Share Unassigned Case';
export const ASSIGN_USERS_TO_UNASSIGNED_CASE = '[ShareCase] Assign Users to Unassigned Case';
export const ASSIGN_USERS_TO_UNASSIGNED_CASE_SUCCESS = '[ShareCase] Assign Users to Unassigned Case Success';
export const RESET_UNASSIGNED_CASE_SELECTION = '[ShareCase] Reset Unassigned Case Selection';

export const LOAD_USERS_FROM_ORG_FOR_CASE = '[LoadUsers] From ORG For A Case';
export const LOAD_USERS_FROM_ORG_FOR_CASE_SUCCESS = '[LoadUsers] From ORG For A Case Success';
export const SYNCHRONIZE_STATE_TO_STORE_ASSIGNED_CASES = '[ShareCase] Synchronize State To Store Assigned Cases';
export const SYNCHRONIZE_STATE_TO_STORE_UNASSIGNED_CASES = '[ShareCase] Synchronize State To Store Unassigned Cases';

export class NavigateToShareAssignedCases implements Action {
  public readonly type = NAVIGATE_TO_SHARE_ASSIGNED_CASES;
  constructor(public payload: SharedCase[]) {}
}

export class NavigateToShareUnassignedCases implements Action {
  public readonly type = NAVIGATE_TO_SHARE_UNASSIGNED_CASES;
  constructor(public payload: SharedCase[]) {}
}

export class SynchronizeStateToStoreAssignedCases implements Action {
  public readonly type = SYNCHRONIZE_STATE_TO_STORE_ASSIGNED_CASES;
  constructor(public payload: SharedCase[]) {}
}

export class SynchronizeStateToStoreUnassignedCases implements Action {
  public readonly type = SYNCHRONIZE_STATE_TO_STORE_UNASSIGNED_CASES;
  constructor(public payload: SharedCase[]) {}
}

export class LoadShareAssignedCases implements Action {
  public readonly type = LOAD_SHARE_ASSIGNED_CASES;
  constructor(public payload: SharedCase[]) {}
}

export class LoadShareAssignedCasesSuccess implements Action {
  public readonly type = LOAD_SHARE_ASSIGNED_CASES_SUCCESS;
  constructor(public payload: SharedCase[]) {}
}

export class LoadShareAssignedCaseFailure implements Action {
  public readonly type = LOAD_SHARE_ASSIGNED_CASES_FAILURE;
  constructor(public payload: Error) {}
}

export class LoadShareUnassignedCases implements Action {
  public readonly type = LOAD_SHARE_UNASSIGNED_CASES;
  constructor(public payload: SharedCase[]) {}
}

export class LoadShareUnassignedCasesSuccess implements Action {
  public readonly type = LOAD_SHARE_UNASSIGNED_CASES_SUCCESS;
  constructor(public payload: SharedCase[]) {}
}

export class LoadShareUnassignedCaseFailure implements Action {
  public readonly type = LOAD_SHARE_UNASSIGNED_CASES_FAILURE;
  constructor(public payload: Error) {}
}

export class AddShareAssignedCases implements Action {
  public readonly type = ADD_SHARE_ASSIGNED_CASES;
  constructor(public payload: {
    path?: any[];
    query?: object;
    extras?: NavigationExtras;
    sharedCases: SharedCase[]
  }) {}
}

export class AddShareAssignedCaseGo implements Action {
  public readonly type = ADD_SHARE_ASSIGNED_CASES_GO;
  constructor(
    public payload: {
      path: any[];
      query?: object;
      extras?: NavigationExtras;
      sharedCases: SharedCase[]
    }
  ) {}
}

export class AddShareUnassignedCases implements Action {
  public readonly type = ADD_SHARE_UNASSIGNED_CASES;
  constructor(public payload: {
    path?: any[];
    query?: object;
    extras?: NavigationExtras;
    sharedCases: SharedCase[]
  }) {}
}

export class AddShareUnassignedCaseGo implements Action {
  public readonly type = ADD_SHARE_UNASSIGNED_CASES_GO;
  constructor(
    public payload: {
      path: any[];
      query?: object;
      extras?: NavigationExtras;
      sharedCases: SharedCase[]
    }
  ) {}
}

export class DeleteAShareAssignedCase implements Action {
  public readonly type = DELETE_A_SHARE_ASSIGNED_CASE;
  constructor(
    public payload: {
      caseId: string;
    }
  ) {}
}

export class DeleteAShareUnassignedCase implements Action {
  public readonly type = DELETE_A_SHARE_UNASSIGNED_CASE;
  constructor(
    public payload: {
      caseId: string;
    }
  ) {}
}

export class AssignUsersToAssignedCase implements Action {
  public readonly type = ASSIGN_USERS_TO_ASSIGNED_CASE;
  constructor(public payload: SharedCase[]) {}
}

export class AssignUsersToAssignedCaseSuccess implements Action {
  public readonly type = ASSIGN_USERS_TO_ASSIGNED_CASE_SUCCESS;
  constructor(public payload: SharedCase[]) {}
}

export class AssignUsersToUnassignedCase implements Action {
  public readonly type = ASSIGN_USERS_TO_UNASSIGNED_CASE;
  constructor(public payload: SharedCase[]) {}
}

export class AssignUsersToUnassignedCaseSuccess implements Action {
  public readonly type = ASSIGN_USERS_TO_UNASSIGNED_CASE_SUCCESS;
  constructor(public payload: SharedCase[]) {}
}

export class ResetAssignedCaseSelection implements Action {
  public readonly type = RESET_ASSIGNED_CASE_SELECTION;
}

export class ResetUnassignedCaseSelection implements Action {
  public readonly type = RESET_UNASSIGNED_CASE_SELECTION;
}

export class LoadUserFromOrgForCase implements Action {
  public readonly type = LOAD_USERS_FROM_ORG_FOR_CASE;
}

export class LoadUserFromOrgForCaseSuccess implements Action {
  public readonly type = LOAD_USERS_FROM_ORG_FOR_CASE_SUCCESS;
  constructor(public payload: UserDetails[]) {}
}

export type Actions =
    NavigateToShareAssignedCases
  | NavigateToShareUnassignedCases
  | SynchronizeStateToStoreAssignedCases
  | SynchronizeStateToStoreUnassignedCases
  | LoadShareAssignedCases
  | LoadShareAssignedCasesSuccess
  | LoadShareAssignedCaseFailure
  | LoadShareUnassignedCases
  | LoadShareUnassignedCasesSuccess
  | LoadShareUnassignedCaseFailure
  | AddShareAssignedCases
  | AddShareAssignedCaseGo
  | AddShareUnassignedCases
  | AddShareUnassignedCaseGo
  | DeleteAShareAssignedCase
  | DeleteAShareUnassignedCase
  | AssignUsersToAssignedCase
  | AssignUsersToAssignedCaseSuccess
  | AssignUsersToUnassignedCase
  | AssignUsersToUnassignedCaseSuccess
  | ResetAssignedCaseSelection
  | ResetUnassignedCaseSelection
  | LoadUserFromOrgForCase
  | LoadUserFromOrgForCaseSuccess;
