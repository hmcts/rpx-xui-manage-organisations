import { createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromOrganisation from '../reducers/organisation.reducer';

export const getOrganisationState = createSelector(
  fromFeature.getRootOrgState,
  (state: fromFeature.OrganisationState) => state?.organisation ?? fromOrganisation.initialState
);

export const getOrganisationSel = createSelector(
  getOrganisationState,
  fromOrganisation.getOrganisation
);

export const getOrganisationLoaded = createSelector(
  getOrganisationState,
  fromOrganisation.getOrganisationLoaded
);

export const getOrganisationError = createSelector(
  getOrganisationState,
  fromOrganisation.getOrganisationError
);

export const getAccessTypes = createSelector(
  getOrganisationState,
  fromOrganisation.getOrganisationAccessTypes
);

export const getAddressUpdateDraft = createSelector(
  getOrganisationState,
  fromOrganisation.getAddressUpdateDraft
);

export const getAddressUpdating = createSelector(
  getOrganisationState,
  fromOrganisation.getAddressUpdating
);

export const getAddressUpdateError = createSelector(
  getOrganisationState,
  fromOrganisation.getAddressUpdateError
);

export const getNameUpdateDraft = createSelector(
  getOrganisationState,
  fromOrganisation.getNameUpdateDraft
);

export const getNameUpdateDraftCompleted = createSelector(
  getOrganisationState,
  fromOrganisation.getNameUpdateDraftCompleted
);

export const getNameUpdating = createSelector(
  getOrganisationState,
  fromOrganisation.getNameUpdating
);

export const getNameUpdateError = createSelector(
  getOrganisationState,
  fromOrganisation.getNameUpdateError
);

export const getSraUpdateDraft = createSelector(
  getOrganisationState,
  fromOrganisation.getSraUpdateDraft
);

export const getSraUpdateDraftCompleted = createSelector(
  getOrganisationState,
  fromOrganisation.getSraUpdateDraftCompleted
);

export const getSraUpdating = createSelector(
  getOrganisationState,
  fromOrganisation.getSraUpdating
);

export const getSraUpdateError = createSelector(
  getOrganisationState,
  fromOrganisation.getSraUpdateError
);
