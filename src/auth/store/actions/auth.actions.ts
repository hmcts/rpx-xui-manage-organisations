import { Action } from '@ngrx/store';
import {AuthInterface} from '../../models/auth.model';
import {HttpErrorResponse} from '@angular/common/http';
import {UserInterface} from '../../models/user.model';


export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',
  LOGOUT = '[Auth] Logout',
  USER = '[User] details',
  USER_SUCCESS = '[User] details Success',
  USER_FAILURE = '[User] details Failure',
}

export class LogIn implements Action {
  readonly type = AuthActionTypes.LOGIN;
  constructor(public payload: any) {}
}

export class LogInSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
  constructor(public payload: AuthInterface) {}
}

export class LogInFailure implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILURE;
  constructor(public payload: HttpErrorResponse) {}
}

export class GetUserDetails implements Action {
  readonly type = AuthActionTypes.USER;
}

export class GetUserDetailsSuccess implements Action {
  readonly type = AuthActionTypes.USER_SUCCESS;
  constructor(public payload: UserInterface) {}
}

export class GetUserDetailsFailure implements Action {
  readonly type = AuthActionTypes.USER_FAILURE;
  constructor(public payload: HttpErrorResponse) {}
}

export class LogOut implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export type AuthActions =
  | LogIn
  | LogInSuccess
  | LogInFailure
  | LogOut
  | GetUserDetails
  | GetUserDetailsSuccess
  | GetUserDetailsFailure;
