import { Jurisdiction, OrganisationDetails } from '../../../models/organisation.model';
import { PBANumberModel } from '../../../models/pbaNumber.model';
import * as fromOrganisation from '../actions/organisation.actions';
import { AddressUpdateDraft } from '../../models/address-update.model';
import { OrganisationNameUpdateDraft } from '../../models/name-update.model';
import { OrganisationSraUpdateDraft } from '../../models/sra-update.model';

export interface OrganisationState {
  organisationDetails: OrganisationDetails | null;
  organisationJurisdictions: Jurisdiction[];
  loaded: boolean;
  loading: boolean;
  error?: any;
  addressUpdateDraft: AddressUpdateDraft | null;
  addressUpdating: boolean;
  addressUpdateError?: any;
  nameUpdateDraft: OrganisationNameUpdateDraft | null;
  nameUpdateDraftCompleted: boolean;
  nameUpdating: boolean;
  nameUpdateError?: any;
  sraUpdateDraft: OrganisationSraUpdateDraft | null;
  sraUpdateDraftCompleted: boolean;
  sraUpdating: boolean;
  sraUpdateError?: any;
}

export const initialState: OrganisationState = {
  organisationDetails: null,
  organisationJurisdictions: [],
  loaded: false,
  loading: false,
  addressUpdateDraft: null,
  addressUpdating: false,
  nameUpdateDraft: null,
  nameUpdateDraftCompleted: false,
  nameUpdating: false,
  sraUpdateDraft: null,
  sraUpdateDraftCompleted: false,
  sraUpdating: false
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
          paymentAccount.push(pbaNumberModel);
        }
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
        organisationJurisdictions: action.payload
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
      const organisationDetails = state.organisationDetails;
      if (organisationDetails === null) {
        throw new Error('Cannot update pending PBAs before organisation details are loaded.');
      }
      return {
        ...state,
        organisationDetails: {
          ...organisationDetails,
          pendingAddPaymentAccount: action.payload
        }
      };
    }

    case fromOrganisation.UPDATE_ORGANISATION_PBA_PENDING_REMOVE: {
      const organisationDetails = state.organisationDetails;
      if (organisationDetails === null) {
        throw new Error('Cannot update pending PBAs before organisation details are loaded.');
      }
      return {
        ...state,
        organisationDetails: {
          ...organisationDetails,
          pendingRemovePaymentAccount: action.payload
        }
      };
    }
    case fromOrganisation.ORGANISATION_UPDATE_PBA_RESPONSE: {
      if (!action.payload) {
        return state;
      }

      const organisationDetails = state.organisationDetails;
      if (organisationDetails === null) {
        throw new Error('Cannot process a PBA response before organisation details are loaded.');
      }

      const existingPaymentAccount = [
        ...organisationDetails.paymentAccount,
        ...organisationDetails.pendingAddPaymentAccount
      ];

      const existingPendingPaymentAccount =
        organisationDetails.pendingPaymentAccount ? organisationDetails.pendingPaymentAccount.slice() : [];

      const existingPendingRemovePaymentAccount = new Set(
        organisationDetails.pendingRemovePaymentAccount
      );

      const updatePaymentAccount = existingPaymentAccount
        .filter((paymentAccount) =>
          !existingPendingRemovePaymentAccount.has(paymentAccount)
        )
        .filter((paymentAccount) => !paymentAccount.status);

      const updatedPendingPaymentAccount =
        organisationDetails.pendingAddPaymentAccount.map(
          (addPaymentAccount) => addPaymentAccount.pbaNumber
        );

      const organisationDetailWithResponse = {
        ...organisationDetails,
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
      const organisationDetails = state.organisationDetails;
      const existingProfileIds =
        organisationDetails?.organisationProfileIds ?? [];

      const profileIds = action.payload
        ? [...new Set([...existingProfileIds, ...action.payload])]
        : existingProfileIds;

      return {
        ...state,
        organisationDetails: {
          ...organisationDetails,
          organisationProfileIds: profileIds
        }
      };
    }

    case fromOrganisation.INITIALISE_ORGANISATION_ADDRESS_UPDATE: {
      return {
        ...state,
        addressUpdateDraft: action.payload,
        addressUpdateError: null
      };
    }

    case fromOrganisation.UPDATE_ORGANISATION_ADDRESS_DRAFT: {
      const addressUpdateDraft = state.addressUpdateDraft;
      if (addressUpdateDraft === null) {
        throw new Error('Cannot update an address draft before it is initialized.');
      }
      return {
        ...state,
        addressUpdateDraft: {
          ...addressUpdateDraft,
          ...action.payload
        },
        addressUpdateError: null
      };
    }

    case fromOrganisation.CLEAR_ORGANISATION_ADDRESS_UPDATE: {
      return {
        ...state,
        addressUpdateDraft: null,
        addressUpdating: false,
        addressUpdateError: null
      };
    }

    case fromOrganisation.ORGANISATION_UPDATE_ADDRESS: {
      return {
        ...state,
        addressUpdating: true,
        addressUpdateError: null
      };
    }

    case fromOrganisation.ORGANISATION_UPDATE_ADDRESS_SUCCESS: {
      const organisationDetails = state.organisationDetails;
      if (organisationDetails === null) {
        throw new Error('Cannot successfully update address before organisation details are loaded.');
      }
      const existingContactInformation = organisationDetails?.contactInformation ?? [];
      return {
        ...state,
        organisationDetails: {
          ...organisationDetails,
          contactInformation: [action.payload, ...existingContactInformation.slice(1)],
          pendingContactInformation: true
        },
        addressUpdateDraft: null,
        addressUpdating: false,
        addressUpdateError: null
      };
    }

    case fromOrganisation.ORGANISATION_UPDATE_ADDRESS_ERROR: {
      return {
        ...state,
        addressUpdating: false,
        addressUpdateError: action.payload
      };
    }

    case fromOrganisation.INITIALISE_ORGANISATION_NAME_UPDATE: {
      return {
        ...state,
        nameUpdateDraft: action.payload,
        nameUpdateDraftCompleted: false,
        nameUpdateError: null
      };
    }

    case fromOrganisation.UPDATE_ORGANISATION_NAME_DRAFT: {
      return {
        ...state,
        nameUpdateDraft: action.payload,
        nameUpdateDraftCompleted: true,
        nameUpdateError: null
      };
    }

    case fromOrganisation.CLEAR_ORGANISATION_NAME_UPDATE: {
      return {
        ...state,
        nameUpdateDraft: null,
        nameUpdateDraftCompleted: false,
        nameUpdating: false,
        nameUpdateError: null
      };
    }

    case fromOrganisation.ORGANISATION_UPDATE_NAME: {
      return {
        ...state,
        nameUpdating: true,
        nameUpdateError: null
      };
    }

    case fromOrganisation.ORGANISATION_UPDATE_NAME_SUCCESS: {
      const organisationDetails = state.organisationDetails;
      if (organisationDetails === null) {
        throw new Error('Cannot successfully update the name before organisation details are loaded.');
      }
      return {
        ...state,
        organisationDetails: {
          ...organisationDetails,
          name: action.payload,
          pendingNameUpdate: true
        },
        nameUpdateDraft: null,
        nameUpdateDraftCompleted: false,
        nameUpdating: false,
        nameUpdateError: null
      };
    }

    case fromOrganisation.ORGANISATION_UPDATE_NAME_ERROR: {
      return {
        ...state,
        nameUpdating: false,
        nameUpdateError: action.payload
      };
    }

    case fromOrganisation.INITIALISE_ORGANISATION_SRA_UPDATE: {
      return {
        ...state,
        sraUpdateDraft: action.payload,
        sraUpdateDraftCompleted: false,
        sraUpdateError: null
      };
    }

    case fromOrganisation.UPDATE_ORGANISATION_SRA_DRAFT: {
      return {
        ...state,
        sraUpdateDraft: action.payload,
        sraUpdateDraftCompleted: true,
        sraUpdateError: null
      };
    }

    case fromOrganisation.CLEAR_ORGANISATION_SRA_UPDATE: {
      return {
        ...state,
        sraUpdateDraft: null,
        sraUpdateDraftCompleted: false,
        sraUpdating: false,
        sraUpdateError: null
      };
    }

    case fromOrganisation.ORGANISATION_UPDATE_SRA: {
      return {
        ...state,
        sraUpdating: true,
        sraUpdateError: null
      };
    }

    case fromOrganisation.ORGANISATION_UPDATE_SRA_SUCCESS: {
      const organisationDetails = state.organisationDetails;
      if (organisationDetails === null) {
        throw new Error('Cannot successfully update the SRA ID before organisation details are loaded.');
      }
      return {
        ...state,
        organisationDetails: {
          ...organisationDetails,
          sraId: action.payload,
          pendingSraUpdate: true
        },
        sraUpdateDraft: null,
        sraUpdateDraftCompleted: false,
        sraUpdating: false,
        sraUpdateError: null
      };
    }

    case fromOrganisation.ORGANISATION_UPDATE_SRA_ERROR: {
      return {
        ...state,
        sraUpdating: false,
        sraUpdateError: action.payload
      };
    }

    default:
      return state;
  }
}

export const getOrganisation = (state: OrganisationState) => state.organisationDetails;
export const getOrganisationLoaded = (state: OrganisationState) => state.loaded;
export const getOrganisationError = (state: OrganisationState) => state.error;
export const getOrganisationAccessTypes = (state: OrganisationState) => state.organisationJurisdictions;
export const getAddressUpdateDraft = (state: OrganisationState) => state.addressUpdateDraft;
export const getAddressUpdating = (state: OrganisationState) => state.addressUpdating;
export const getAddressUpdateError = (state: OrganisationState) => state.addressUpdateError;
export const getNameUpdateDraft = (state: OrganisationState) => state.nameUpdateDraft;
export const getNameUpdateDraftCompleted = (state: OrganisationState) => state.nameUpdateDraftCompleted;
export const getNameUpdating = (state: OrganisationState) => state.nameUpdating;
export const getNameUpdateError = (state: OrganisationState) => state.nameUpdateError;
export const getSraUpdateDraft = (state: OrganisationState) => state.sraUpdateDraft;
export const getSraUpdateDraftCompleted = (state: OrganisationState) => state.sraUpdateDraftCompleted;
export const getSraUpdating = (state: OrganisationState) => state.sraUpdating;
export const getSraUpdateError = (state: OrganisationState) => state.sraUpdateError;
