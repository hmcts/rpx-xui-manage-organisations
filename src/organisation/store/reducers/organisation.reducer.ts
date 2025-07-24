import { OrganisationDetails } from '../../../models/organisation.model';
import { PBANumberModel } from '../../../models/pbaNumber.model';
import * as fromOrganisation from '../actions/organisation.actions';

export interface OrganisationState {
  organisationDetails: OrganisationDetails;
  loaded: boolean;
  loading: boolean;
  error?: any;
}

export const initialState: OrganisationState = {
  organisationDetails: null,
  loaded: false,
  loading: false
};

export function reducer(
  state = initialState,
  action: fromOrganisation.organisationActions
): OrganisationState {
  switch (action.type) {
    case fromOrganisation.LOAD_ORGANISATION: {
      return {
        ...state,
        loaded: false,
        loading: true
      };
    }
    case fromOrganisation.LOAD_ORGANISATION_SUCCESS: {
      const paymentAccount: PBANumberModel[] = [];
      // if the users are loaded before organisation, the profile ids will be added since this is not provided by the GET operation
      const newPayload = { ...action.payload, organisationProfileIds: state.organisationDetails?.organisationProfileIds };
      const newAction = { ...action, payload: newPayload };
      newPayload.paymentAccount.forEach((pba) => {
        let pbaNumberModel: PBANumberModel = { pbaNumber: '' };
        if (typeof pba === 'string') {
          pbaNumberModel = {
            pbaNumber: pba
          };
        }
        paymentAccount.push(pbaNumberModel);
      });
      const loadedOrgDetails = {
        ...newAction.payload,
        paymentAccount,
        pendingAddPaymentAccount: [],
        pendingRemovePaymentAccount: []
      };
      return {
        ...state,
        organisationDetails: loadedOrgDetails,
        loaded: true
      };
    }

    case fromOrganisation.UPDATE_ORGANISATION_PBA_PENDING_ADD: {
      const orgDetails = {
        ...state.organisationDetails,
        pendingAddPaymentAccount: action.payload
      };
      return {
        ...state,
        organisationDetails: orgDetails
      };
    }

    case fromOrganisation.UPDATE_ORGANISATION_PBA_PENDING_REMOVE: {
      const orgDetails = {
        ...state.organisationDetails,
        pendingRemovePaymentAccount: action.payload
      };
      return {
        ...state,
        organisationDetails: orgDetails
      };
    }

    case fromOrganisation.ORGANISATION_UPDATE_PBA_RESPONSE:
      let organisationDetailWithResponse = { ...state.organisationDetails };
      console.log('action', action);
      if (action.payload) {
        let existingPaymentAccount = state.organisationDetails.paymentAccount.slice();
        const existingPendingPaymentAccount = state.organisationDetails.pendingPaymentAccount.slice();
        const existingPendingAddPaymentAccount = state.organisationDetails.pendingAddPaymentAccount.slice();
        const existingPendingRemovePaymentAccount = state.organisationDetails.pendingRemovePaymentAccount.slice();
        existingPaymentAccount = [...existingPaymentAccount, ...existingPendingAddPaymentAccount];
        const updatePaymentAccount =
          existingPaymentAccount
            .filter((paymentAccounts) => !existingPendingRemovePaymentAccount.includes(paymentAccounts))
            .filter((filtered) => !filtered.status);

        const updatedPendingPaymentAccount = existingPendingAddPaymentAccount
          .map((addPaymentAccount) => addPaymentAccount.pbaNumber);

        console.log('exitingPendingAddPaymentAccount', existingPendingAddPaymentAccount);
        console.log('exitingPendingRemovePaymentAccount', existingPendingRemovePaymentAccount);
        console.log('existingPendingPaymentAccount', existingPendingPaymentAccount);
        console.log('updatePaymentAccount', updatePaymentAccount);
        console.log('updatedPendingPaymentAccount', updatedPendingPaymentAccount);

        console.log([...updatedPendingPaymentAccount, ...existingPendingPaymentAccount]);

        organisationDetailWithResponse = {
          ...state.organisationDetails,
          response: action.payload,
          paymentAccount: updatePaymentAccount,
          pendingPaymentAccount: [...updatedPendingPaymentAccount, ...existingPendingPaymentAccount],
          pendingAddPaymentAccount: [],
          pendingRemovePaymentAccount: []
        };
      }

      return {
        ...state,
        organisationDetails: organisationDetailWithResponse
      };

    case fromOrganisation.ORGANISATION_UPDATE_PBA_ERROR:
      return {
        ...state,
        error: action.payload
      };

    case fromOrganisation.ORGANISATION_UPDATE_PBA_ERROR_RESET:
      if (state.error) {
        state = { ...state, error: {} };
      }
      return state;

    case fromOrganisation.ORGANISATION_UPDATE_PROFILE_IDS:
      let profileIds: string[] = [];
      if (state.organisationDetails?.organisationProfileIds){
        profileIds = state.organisationDetails?.organisationProfileIds ?? [];
      }
      profileIds = [...new Set([...profileIds ?? [], ...action.payload])];
      return {
        ...state,
        organisationDetails: {
          ...state.organisationDetails,
          organisationProfileIds: profileIds
        }
      };

    default:
      return state;
  }
}

export const getOrganisation = (state: OrganisationState) => state.organisationDetails;
export const getOrganisationLoaded = (state: OrganisationState) => state.loaded;
export const getOrganisationError = (state: OrganisationState) => state.error;
