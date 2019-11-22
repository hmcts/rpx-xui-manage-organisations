import { Action } from '@ngrx/store';
import {HttpErrorResponse} from '@angular/common/http';
import {UserInterface} from '../../models/user.model';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_FAILURE = '[Auth] Login Failure',
  GET_USER_DETAILS = '[User] Get User Details',
  GET_USER_DETAILS_SUCCESS = '[User] Get User Details Success',
  GET_USER_DETAILS_FAIL = '[User] Get User Details Fail',
  LOAD_HAS_ACCEPTED_TC = '[T&C] Load Has Accepted',
  LOAD_HAS_ACCEPTED_TC_SUCCESS = '[T&C] Load Has Accepted Success',
  LOAD_HAS_ACCEPTED_TC_FAIL = '[T&C] Load Has Accepted Fail',
  ACCEPT_T_AND_C = '[T&C] Accept T&C',
  ACCEPT_T_AND_C_SUCCESS = '[T&C] Accept T&C Success',
  ACCEPT_T_AND_C_FAIL = '[T&C] Accept T&C Fail'
}

export class LogIn implements Action {
  readonly type = AuthActionTypes.LOGIN;
  constructor(public payload: any) {}
}

export class LogInFailure implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILURE;
  constructor(public payload: HttpErrorResponse) {}
}

export class GetUserDetails implements Action {
  readonly type = AuthActionTypes.GET_USER_DETAILS;
}

export class GetUserDetailsSuccess implements Action {
  readonly type = AuthActionTypes.GET_USER_DETAILS_SUCCESS;
  constructor(public payload: UserInterface) {}
}

export class GetUserDetailsFailure implements Action {
  readonly type = AuthActionTypes.GET_USER_DETAILS_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoadHasAcceptedTC implements Action {
  readonly type = AuthActionTypes.LOAD_HAS_ACCEPTED_TC;
  constructor(public payload: string) {}
}

export class LoadHasAcceptedTCSuccess implements Action {
  readonly type = AuthActionTypes.LOAD_HAS_ACCEPTED_TC_SUCCESS;
  constructor(public payload: string) {}
}

export class LoadHasAcceptedTCFail implements Action {
  readonly type = AuthActionTypes.LOAD_HAS_ACCEPTED_TC_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class AcceptTandC implements Action {
  readonly type = AuthActionTypes.ACCEPT_T_AND_C;
  constructor(public payload: any) {}
}

export class AcceptTandCSuccess implements Action {
  readonly type = AuthActionTypes.ACCEPT_T_AND_C_SUCCESS;
  constructor(public payload: boolean) {}
}

export class AcceptTandCFail implements Action {
  readonly type = AuthActionTypes.ACCEPT_T_AND_C_FAIL;
  constructor(public payload: any) {}
}

export type UserProfileActions =
  | LogIn
  | LogInFailure
  | GetUserDetails
  | GetUserDetailsSuccess
  | GetUserDetailsFailure
  | LoadHasAcceptedTC
  | LoadHasAcceptedTCSuccess
  | LoadHasAcceptedTCFail
  | AcceptTandC
  | AcceptTandCSuccess
  | AcceptTandCFail;
