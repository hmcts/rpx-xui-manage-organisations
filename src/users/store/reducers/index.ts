import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromLogin from './users.reducer';


export interface LoginState {
  users: fromLogin.LoginState;
}

export const reducers: ActionReducerMap<LoginState> = {
  users: fromLogin.reducer,
};

export const getRootLoginState = createFeatureSelector<LoginState>(
  'users'
);
