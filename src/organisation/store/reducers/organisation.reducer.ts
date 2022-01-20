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
      action.payload.paymentAccount.forEach(pba => {
        let pbaNumberModel: PBANumberModel;
        if (typeof pba === 'string') {
          pbaNumberModel = {
            pbaNumber: pba,
          };
        }
        paymentAccount.push(pbaNumberModel);
      });
      const loadedOrgDetails = {
        ...action.payload,
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
      const organisationDetails = state.organisationDetails;
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
      const organisationDetails = state.organisationDetails;
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
      let organisationDetailWithResponse = {...state.organisationDetails};
      if (action.payload) {
        let exitingPaymentAccount = state.organisationDetails.paymentAccount.slice();
        const exitingPendingAddPaymentAccount = state.organisationDetails.pendingAddPaymentAccount.slice();
        const exitingPendingRemovePaymentAccount = state.organisationDetails.pendingRemovePaymentAccount.slice();
        exitingPaymentAccount = [...exitingPaymentAccount, ...exitingPendingAddPaymentAccount];
        const updatePaymentAccount = exitingPaymentAccount.filter(paymentAccounts => !exitingPendingRemovePaymentAccount.includes(paymentAccounts));
        organisationDetailWithResponse = {
          ...state.organisationDetails,
          response: action.payload,
          paymentAccount: updatePaymentAccount,
          pendingAddPaymentAccount: [],
          pendingRemovePaymentAccount: [],
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

    default:
      return state;
  }
}

export const getOrganisation = (state: OrganisationState) => state.organisationDetails;
export const getOrganisationLoaded = (state: OrganisationState) => state.loaded;
export const getOrganisationError = (state: OrganisationState) => state.error;
