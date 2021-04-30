import * as fromOrganisation from '../actions/organisation.actions';
import { Organisation } from 'src/organisation/organisation.model';
export interface OrganisationState {
  organisationDetails: Organisation;
  loaded: boolean;
  loading: boolean;
}

export const initialState: OrganisationState = {
  organisationDetails: new Organisation({}),
  loaded: false,
  loading: false,
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
      const organisationDetails = new Organisation(action.payload);
      organisationDetails.response = null;
      return {
        ...state,
        organisationDetails,
        loaded: true
      };

    }

    case fromOrganisation.UPDATE_ORGANISATION_PBA_PENDING_ADD: {
      const organisationDetails = new Organisation(state.organisationDetails);
      const pendingAddPbaNumbers = action.payload as string[];

      organisationDetails.pendingAddPaymentAccount = pendingAddPbaNumbers
        .filter((pba, index, array) => array.indexOf(pba) === index);
      organisationDetails.response = null;
      return {
        ...state,
        organisationDetails
      };
    }

    case fromOrganisation.UPDATE_ORGANISATION_PBA_PENDING_REMOVE: {
      const organisationDetails = new Organisation(state.organisationDetails);
      const pendingRemovePbaNumbers = action.payload as string[];

      organisationDetails.pendingRemovePaymentAccount = pendingRemovePbaNumbers
        .filter((pba, index, array) => array.indexOf(pba) === index);
      organisationDetails.response = null;
      return {
        ...state,
        organisationDetails
      };
    }

    case fromOrganisation.ORGANISATION_UPDATE_PBA_RESPONSE:
      let organisationDetailWithResponse = {...state.organisationDetails};
      if (action.payload && action.payload.code === 200) {
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
  }

  return state;
}

export const getOrganisation = (state: OrganisationState) => state.organisationDetails;
export const getOrganisationLoading = (state: OrganisationState) => state.loading;
export const getOrganisationLoaded = (state: OrganisationState) => state.loaded;
