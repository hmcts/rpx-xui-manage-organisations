import { PBANumberModel } from '../../models/pbaNumber.model';
import { DxAddress, OrganisationContactInformation, OrganisationDetails } from '../../models';
import { AddressUpdateDraft } from '../models/address-update.model';
import { Regulator } from '../../register-org/models';
import { OrgManagerConstants } from '../organisation-constants';

const containsItems = (obj: object, arrayProperty: string): boolean => {
  return obj && (obj[arrayProperty] || []).length > 0;
};

const utils = {
  getContactInformation: (organisationDetails: Partial<OrganisationDetails>): OrganisationContactInformation | null => {
    if (containsItems(organisationDetails, 'contactInformation')) {
      return organisationDetails.contactInformation?.[0] ?? null;
    }
    return null;
  },
  getDxAddress: (contactInformation: Partial<OrganisationContactInformation>): DxAddress | null => {
    if (containsItems(contactInformation, 'dxAddress')) {
      return contactInformation.dxAddress?.[0] ?? null;
    }
    return null;
  },
  getCompanyRegistrationNumber: (organisationDetails: Partial<OrganisationDetails>): string => {
    if (containsItems(organisationDetails, 'companyRegistrationNumber')) {
      return organisationDetails.companyRegistrationNumber ?? '';
    }
    return '';
  },
  getOrganisationType: (organisationDetails: Partial<OrganisationDetails>): string => {
    if (containsItems(organisationDetails, 'orgType')) {
      return organisationDetails.orgType ?? '';
    }
    return '';
  },
  // note: this does not get invdividual regulators as no display requirement for them
  getRegulators: (organisationDetails: Partial<OrganisationDetails>): Regulator[] => {
    if (
      containsItems(organisationDetails, 'orgAttributes') &&
      organisationDetails.orgAttributes?.some((orgAttribute) =>
        orgAttribute.key.includes('regulator')
      )
    ) {
      const regulatorAttributes = organisationDetails.orgAttributes?.filter(
        (orgAttribute) => orgAttribute.key.includes('regulator')
      ) ?? [];

      return regulatorAttributes.map((regAttribute) =>
        JSON.parse(regAttribute.value) as Regulator
      );
    }

    return [];
  },
  getPaymentAccount: (organisationDetails: Partial<OrganisationDetails>): PBANumberModel[] => {
    if (containsItems(organisationDetails, 'paymentAccount')) {
      return organisationDetails.paymentAccount ?? [];
    }
    return [];
  },
  getPendingPaymentAccount: (organisationDetails: Partial<OrganisationDetails>): string[] => {
    if (containsItems(organisationDetails, 'pendingPaymentAccount')) {
      return organisationDetails.pendingPaymentAccount ?? [];
    }
    return [];
  },
  getErrorDuplicateHeaderMessage(pbaNumber: string) {
    return OrgManagerConstants.PBA_ERROR_ALREADY_USED_HEADER_MESSAGES[0].replace(OrgManagerConstants.PBA_MESSAGE_PLACEHOLDER, pbaNumber);
  },
  getErrorDuplicateMessage(pbaNumber: string) {
    return OrgManagerConstants.PBA_ERROR_ALREADY_USED_MESSAGES[0].replace(OrgManagerConstants.PBA_MESSAGE_PLACEHOLDER, pbaNumber);
  },

  getEmptyAddressUpdateDraft: (): AddressUpdateDraft => ({
    address: {
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postTown: null,
      county: null,
      country: 'UK',
      postCode: null
    },
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null,
    inInternationalMode: false,
    showExistingAddress: false
  }),

  getContactInformationFromAddressUpdate: (draftAddress: AddressUpdateDraft): OrganisationContactInformation => ({
    addressLine1: draftAddress.address.addressLine1 ?? null,
    addressLine2: draftAddress.address.addressLine2 ?? null,
    addressLine3: draftAddress.address.addressLine3 ?? null,
    townCity: draftAddress.address.postTown ?? null,
    county: draftAddress.address.county ?? null,
    country: draftAddress.address.country ?? null,
    postCode: draftAddress.address.postCode ?? null,
    dxAddress: draftAddress.hasDxReference
      ? [{
        dxNumber: draftAddress.dxNumber,
        dxExchange: draftAddress.dxExchange
      }]
      : []
  })
};

export { utils };
