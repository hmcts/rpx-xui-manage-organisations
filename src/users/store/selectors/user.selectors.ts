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

export const getGetSingleUserState = createSelector(
  fromFeature.getRootUserState,
  (state: fromFeature.UserState) => state.selectedUser
);

export const getGetSingleUser = createSelector(
  getGetSingleUserState,
  fromUsers.getSingleUser
);

export const getGetSingleUserLoaded = createSelector(
  getGetSingleUserState,
  fromUsers.getSingleUserLoaded
);

export const getGetSingleUserLoading = createSelector(
  getGetSingleUserState,
  fromUsers.getSingleUserLoading
);
