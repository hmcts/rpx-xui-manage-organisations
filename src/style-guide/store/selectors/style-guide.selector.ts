import { createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromInviteUsers from '../reducers/style-guide.reducer';

export const getInviteUserState = createSelector(
  fromFeature.getRootStyleGuideState,
  (state: fromFeature.UserState) => state.guide
);

export const getStyleGuideErrorMessage = createSelector(
  getInviteUserState,
  fromInviteUsers.getInviteUserErrorMessage
);

export const getStyleGuideIsFormValid = createSelector(
  getInviteUserState,
  fromInviteUsers.getStyleGuideIsFormValid
);
/**
 * Filtering out empty stings, that are not errors
 */
export const getGetStyleGuideErrorsArray = createSelector(
  getStyleGuideErrorMessage,
  getStyleGuideIsFormValid,
  (obj, isFormValid) => {

    const items =  Object.keys(obj).map(key => {
      if (key) {
        return {
            id: key,
            message: obj[key].messages.filter((el) => el !== '')
        };
      }
    });

    return {
      isFromValid: isFormValid,
      items
    };

  }
);
