import { createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromInviteUsers from '../reducers/invite-user.reducer';

export const getInviteUserState = createSelector(
  fromFeature.getRootUserState,
  (state: fromFeature.UserState) => state.inviteUser
);

export const getInviteUserErrorMessage = createSelector(
  getInviteUserState,
  fromInviteUsers.getInviteUserErrorMessage
);

export const getInviteUserIsFormValid = createSelector(
  getInviteUserState,
  fromInviteUsers.getInviteUserIsFormValid
);

export const getInviteUserErrorHeader = createSelector(
  getInviteUserState,
  fromInviteUsers.getInviteUserErrorHeader
);

export const getInviteUserIsUserConfirmed = createSelector(
  getInviteUserState,
  fromInviteUsers.getInviteUserIsUserConfirmed
);

export const getInviteUserEmail = createSelector(
  getInviteUserState,
  fromInviteUsers.getInviteUserEmail
);

export const getGetInviteUserErrorsArray = createSelector(
  getInviteUserErrorMessage,
  getInviteUserIsFormValid,
  getInviteUserErrorHeader,
  (obj, isFormValid, header) => {
    const items = Object.keys(obj).map(key => {
      if (key) {
        return {
          id: key,
          message: obj[key].messages.filter((el) => el !== '')
        };
      }
    });

    return {
      isFromValid: isFormValid,
      header,
      items
    };

  }
);
