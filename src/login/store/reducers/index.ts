import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromLogin from './login.reducer';


export interface LoginState {
  login: fromLogin.LoginFormState;
}

export const reducers: ActionReducerMap<LoginState> = {
  login: fromLogin.reducer,
};

export const getRootLoginState = createFeatureSelector<LoginState>(
  'login'
);
