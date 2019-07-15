import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromUsers from './users.reducer';
import * as fromInviteUser from './invite-user.reducer';

export interface UserState {
  invitedUsers: fromUsers.UsersListState;
  inviteUser: fromInviteUser.InviteUserState;
}

export const reducers: ActionReducerMap<UserState> = {
  invitedUsers: fromUsers.reducer,
  inviteUser: fromInviteUser.reducer
};

export const getRootUserState = createFeatureSelector<UserState>(
  'users'
);




