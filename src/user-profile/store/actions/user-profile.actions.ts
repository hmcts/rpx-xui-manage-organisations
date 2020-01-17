import { Action } from '@ngrx/store';
import {AuthInterface} from '../../models/auth.model';
import {HttpErrorResponse} from '@angular/common/http';
import {UserInterface} from '../../models/user.model';


export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_FAILURE = '[Auth] Login Failure',
  GET_USER_DETAILS = '[User] Get User Details',
  GET_USER_DETAILS_SUCCESS = '[User] Get User Details Success',
  GET_USER_DETAILS_FAIL = '[User]Get User Details Fail',
  SET_MODAL = '[APP] Set Modal',
  SIGNED_OUT = '[App] Signed Out',
  KEEP_ALIVE = '[App] Keep Alive',
  SIGNED_OUT_SUCCESS = '[App] Signed Out Success',
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

export class SetModal implements Action {
  readonly type = AuthActionTypes.SET_MODAL;
  constructor(public payload: {[id: string]: {isVisible?: boolean; countdown?: string}}) { }
}

export class SignedOut implements Action {
  readonly type = AuthActionTypes.SIGNED_OUT;
}

export class SignedOutSuccess implements Action {
  readonly type = AuthActionTypes.SIGNED_OUT_SUCCESS;
}

export class KeepAlive implements Action {
  readonly type = AuthActionTypes.KEEP_ALIVE;
}


export type UserProfileActions =
  | LogIn
  | LogInFailure
  | GetUserDetails
  | GetUserDetailsSuccess
  | GetUserDetailsFailure
  | SetModal
  | SignedOut
  | SignedOutSuccess
  | KeepAlive;
