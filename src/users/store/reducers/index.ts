import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromUsers from './users.reducer';
import * as fromInviteUser from './invite-user.reducer';

export interface UserState {
  invitedUsers: fromUsers.UsersListState;
  inviteUser: fromInviteUser.InviteUserState;
  selectedUser: fromUsers.SelectedUserState;
}

export const reducers: ActionReducerMap<UserState> = {
  invitedUsers: fromUsers.reducer,
  inviteUser: fromInviteUser.reducer,
  selectedUser: fromUsers.selectedUserReducer
};

export const getRootUserState = createFeatureSelector<UserState>(
  'users'
);




