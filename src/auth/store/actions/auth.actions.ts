import { Action } from '@ngrx/store';


export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',
  LOGOUT = '[Auth] Logout',
  FORGOT_PASSWORD = '[Auth] Forgot Password',
  FORGOT_PASSWORD_SUCCESS = '[Auth] Forgot Password Success',
  FORGOT_PASSWORD_FAIL= '[Auth] Forgot Password Fail',
  RESET_STORE_GLOBAL = '[Auth] Reset Store Global',
  RESET_PASSWORD = '[Auth] Reset Password',
  RESET_PASSWORD_SUCCESS = '[Auth] Reset Password Success',
  RESET_PASSWORD_FAIL = '[Auth] Reset Password Fail'
}

export class LogIn implements Action {
  readonly type = AuthActionTypes.LOGIN;
  constructor(public payload: any) {}
}

export class LogInSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
  constructor(public payload: any) {}
}

export class LogInFailure implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILURE;
  constructor(public payload: any) {}
}

export class LogOut implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export type AuthActions =
  | LogIn
  | LogInSuccess
  | LogInFailure
  | LogOut;
