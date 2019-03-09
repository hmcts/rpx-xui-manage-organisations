import { createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromInviteUsers from '../reducers/invite-user.reducer';

export const getInviteUserState = createSelector(
  fromFeature.getRootUserState,
  (state: fromFeature.UserState) => state.inviteUser
);

export const getGetInviteUserList = createSelector(
  getInviteUserState,
  fromInviteUsers.getInviteUserErrorMessage
);

export const getGetInviteUserArray = createSelector(
  getGetInviteUserList,
  obj => {
    return Object.values(obj).filter(key => {
      if (key) {
        return key;
      }
    });
  }
);
