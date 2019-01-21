import { createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromRegistration from '../../store/reducers/registration.reducer';

export const getRegistrationState = createSelector(
  fromFeature.getRootRegState,
  (state: fromFeature.RegistrationState) => state.registration
);

export const getRegistationEntities = createSelector(
  getRegistrationState,
  fromRegistration.getRegistationFormEntities
);
