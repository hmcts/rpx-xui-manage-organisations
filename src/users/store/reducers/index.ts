import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromLogin from './users.reducer';


export interface UserState {
  users: fromLogin.UsersState;
}

export const reducers: ActionReducerMap<UserState> = {
  users: fromLogin.reducer,
};

export const getRootUserState = createFeatureSelector<UserState>(
  'users'
);
