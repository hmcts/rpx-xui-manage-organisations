import { Action } from '@ngrx/store';
import {AuthInterface} from '../../models/auth.model';
import {HttpErrorResponse} from '@angular/common/http';
import {UserInterface} from '../../models/user.model';


export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_FAILURE = '[Auth] Login Failure',
  LOGOUT = '[Auth] Logout',
  GET_USER_DETAILS = '[User] Get User Details',
  GET_USER_DETAILS_SUCCESS = '[User] Get User Details Success',
  GET_USER_DETAILS_FAIL = '[User]Get User Details Fail',
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

export class LogOut implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export type UserProfileActions =
  | LogIn
  | LogInFailure
  | LogOut
  | GetUserDetails
  | GetUserDetailsSuccess
  | GetUserDetailsFailure;
