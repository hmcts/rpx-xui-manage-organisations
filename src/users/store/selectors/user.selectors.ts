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

export const getGetUserLoading = createSelector(
  getUserState,
  fromUsers.getLoginFormLoading
);

export const getGetSingleUser = createSelector(
  fromFeature.getRootUserState,
  (state: fromFeature.UserState, prop) => {
    console.log(prop);
    return state.invitedUsers.userList.find(item => item['userIdentifier'] === prop.userIdentifier);
  }
);
