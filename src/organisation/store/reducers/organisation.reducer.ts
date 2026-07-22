import { Jurisdiction, OrganisationDetails } from '../../../models/organisation.model';
import { PBANumberModel } from '../../../models/pbaNumber.model';
import * as fromOrganisation from '../actions/organisation.actions';

export interface OrganisationState {
  organisationDetails: OrganisationDetails;
  organisationJurisdications: Jurisdiction[];
  loaded: boolean;
  loading: boolean;
  error?: any;
}

export const initialState: OrganisationState = {
  organisationDetails: null,
  organisationJurisdications: [],
  loaded: false,
  loading: false
};

export function reducer(
  state = initialState,
  action: fromOrganisation.organisationActions
): OrganisationState {
  switch (action.type) {
    case fromOrganisation.LOAD_ORGANISATION:
    case fromOrganisation.LOAD_ORGANISATION_ACCESS_TYPES: {
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
        let pbaNumberModel: PBANumberModel;
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

    case fromOrganisation.LOAD_ORGANISATION_ACCESS_TYPES_SUCCESS: {
      return {
        ...state,
        loading: false,
        organisationJurisdications: action.payload
      };
    }

    case fromOrganisation.LOAD_ORGANISATION_ACCESS_TYPES_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
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
    case fromOrganisation.ORGANISATION_UPDATE_PBA_RESPONSE: {
      if (!action.payload) {
        return {
          ...state,
          organisationDetails: { ...state.organisationDetails }
        };
      }

      const existingPaymentAccount = [
        ...state.organisationDetails.paymentAccount,
        ...state.organisationDetails.pendingAddPaymentAccount
      ];

      const existingPendingPaymentAccount =
        state.organisationDetails.pendingPaymentAccount.slice();

      const existingPendingRemovePaymentAccount = new Set(
        state.organisationDetails.pendingRemovePaymentAccount
      );

      const updatePaymentAccount = existingPaymentAccount
        .filter((paymentAccount) =>
          !existingPendingRemovePaymentAccount.has(paymentAccount)
        )
        .filter((paymentAccount) => !paymentAccount.status);

      const updatedPendingPaymentAccount =
        state.organisationDetails.pendingAddPaymentAccount.map(
          (addPaymentAccount) => addPaymentAccount.pbaNumber
        );

      const organisationDetailWithResponse = {
        ...state.organisationDetails,
        response: action.payload,
        paymentAccount: updatePaymentAccount,
        pendingPaymentAccount: [
          ...updatedPendingPaymentAccount,
          ...existingPendingPaymentAccount
        ],
        pendingAddPaymentAccount: [],
        pendingRemovePaymentAccount: []
      };

      return {
        ...state,
        organisationDetails: organisationDetailWithResponse
      };
    }
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

    case fromOrganisation.ORGANISATION_UPDATE_PROFILE_IDS: {
      const existingProfileIds =
        state.organisationDetails?.organisationProfileIds ?? [];

      const profileIds = action.payload
        ? [...new Set([...existingProfileIds, ...action.payload])]
        : existingProfileIds;

      return {
        ...state,
        organisationDetails: {
          ...state.organisationDetails,
          organisationProfileIds: profileIds
        }
      };
    }

    default:
      return state;
  }
}

export const getOrganisation = (state: OrganisationState) => state.organisationDetails;
export const getOrganisationLoaded = (state: OrganisationState) => state.loaded;
export const getOrganisationError = (state: OrganisationState) => state.error;
export const getOrganisationAccessTypes = (state: OrganisationState) => state.organisationJurisdications;
