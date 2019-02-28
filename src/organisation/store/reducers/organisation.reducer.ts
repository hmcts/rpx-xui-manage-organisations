import * as fromOrganisation from '../actions/organisation.actions';
import { Organisation } from 'src/organisation/organisation.model';


export interface OrganisationState {
  organisation: Organisation;
  loaded: boolean;
  loading: boolean;
}

export const initialState: OrganisationState = {
  organisation: new Organisation({}),
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromOrganisation.organisationActions
): OrganisationState {
  switch (action.type) {
    case fromOrganisation.LOAD_ORGANISATION_SUCCESS: {
      const organisation = new Organisation(action.payload);
      return {
        ...state,
        organisation,
        loaded: true
      }

    }

  }

  return state;
}

export const getOrganisation = (state: OrganisationState) => state.organisation;
export const getOrganisationLoading = (state: OrganisationState) => state.loading;
export const getOrganisationLoaded = (state: OrganisationState) => state.loaded;

