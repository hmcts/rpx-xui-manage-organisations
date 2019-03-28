import { createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromUsers from '../reducers/users.reducer';

export const getUserState = createSelector(
  fromFeature.getRootUserState,
  (state: fromFeature.UserState) => state.users
);

export const getGetUserList = createSelector(
  getUserState,
  fromUsers.getUsers
);

export const getGetUserLoading = createSelector(
  getUserState,
  fromUsers.getLoginFormLoading
);


