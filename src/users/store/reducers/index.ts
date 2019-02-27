import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromUsers from './users.reducer';

export interface UserState {
  users: fromUsers.UsersState;
}

export const reducers: ActionReducerMap<UserState> = {
  users: fromUsers.reducer
};

export const getRootUserState = createFeatureSelector<UserState>(
  'users'
);




