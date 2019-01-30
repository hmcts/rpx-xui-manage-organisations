import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromLogin from './users.reducer';
import * as fromUserform from './userform.reducer';


export interface UserState {
  users: fromLogin.UsersState;
}

export interface UserformState {
  userform: fromUserform.UserformState;
}

export const reducers: ActionReducerMap<UserState> = {
  users: fromLogin.reducer,
};

export const userformreducers: ActionReducerMap<UserformState> = {
  userform: fromUserform.reducer,
};

export const getRootUserState = createFeatureSelector<UserState>(
  'users'
);




