import { createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromUsers from '../reducers/users.reducer';

export const getUserState = createSelector(
  fromFeature.getRootUserState,
  (state: fromFeature.UserState) => state.invitedUsers
);

export const getUserList = createSelector(
  getUserState,
  fromUsers.getUsers
);

export const getUserLoaded = createSelector(
  getUserState,
  fromUsers.getUsersLoaded
);

export const getUserLoading = createSelector(
  getUserState,
  fromUsers.getUsersLoading
);

export const getSelectedUserState = createSelector(
  fromFeature.getRootUserState,
  (state: fromFeature.UserState) => state.selectedUser
);

export const getSelectedUser = createSelector(
  getSelectedUserState,
  fromUsers.getSelectedUser
);

export const getSelectedUserLoaded = createSelector(
  getSelectedUserState,
  fromUsers.getSelectedUserLoaded
);

export const getSelectedUserLoading = createSelector(
  getSelectedUserState,
  fromUsers.getSelectedUserLoading
);
