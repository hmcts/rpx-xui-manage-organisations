import { createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromInviteUsers from '../reducers/invite-user.reducer';

export const getInviteUserState = createSelector(
  fromFeature.getRootUserState,
  (state: fromFeature.UserState) => state.inviteUser
);

export const getGetInviteUserErrorMessage = createSelector(
  getInviteUserState,
  fromInviteUsers.getInviteUserErrorMessage
);

export const getGetInviteUserArray = createSelector(
  getGetInviteUserErrorMessage,
  obj => {
    return Object.keys(obj).map(key => {
      if (key) {
        return {
            id: key,
            message: obj[key].messages.filter((el) => el !== '')
        };
      }
    });

  }
);
