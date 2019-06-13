import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../app/store';
import * as fromFeature from '../../store/reducers';
import * as fromRegistration from '../../store/reducers/registration.reducer';

export const getRegistrationState = createSelector(
  fromFeature.getRootRegState,
  (state: fromFeature.RegistrationState) => state.registration
);

export const getRegistrationPages = createSelector(
  getRegistrationState,
  fromRegistration.getRegistrationFormPages
);

export const getRegistrationPagesValues = createSelector(
  getRegistrationState,
  fromRegistration.getRegistrationFormPagesValues
);

export const getCurrentPage = createSelector(
  fromRoot.getRouterState,
  (router) => router.state.params
);

export const getIsRegistrationSubmitted = createSelector(
  getRegistrationState,
  fromRegistration.getRegistartionFromPagesSubmited
);

export const getCurrentPageItems = createSelector(
  getRegistrationPages,
  fromRoot.getRouterState,
  getRegistrationPagesValues,
  (state, router, pageValues) => {
    return {
      pageItems: state[router.state.params.pageId],
      pageValues
    };

  }
);




