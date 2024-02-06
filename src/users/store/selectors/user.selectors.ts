import { createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromUsers from '../reducers/users.reducer';

export const getUserState = createSelector(
  fromFeature.getRootUserState,
  (state: fromFeature.UserState) => state.invitedUsers
);

export const getGetUserList = createSelector(
  getUserState,
  fromUsers.getUsers
);

export const getGetUserLoaded = createSelector(
  getUserState,
  fromUsers.getUsersLoaded
);

export const getGetUserLoading = createSelector(
  getUserState,
  fromUsers.getUsersLoading
);

export const getGetSingleUser = createSelector(
  fromFeature.getRootUserState,
  (state: fromFeature.UserState) => state.invitedUsers.userDetails
);

export const getGetReinvitePendingUser = createSelector(
  getUserState,
  fromUsers.getReinvitePendingUser
);

export const editUserFailureSelector = createSelector(
  getUserState,
  fromUsers.getEditUserFailure
);

export const getUserDetails = createSelector(
  getUserState,
  fromUsers.getUserDetails
);

export const getLoadUserListNeeded = createSelector(
  getUserState,
  fromUsers.getLoadUserListNeeded
);
