import { DxAddress, OrganisationContactInformation, OrganisationDetails, PBANumberModel } from '../../models';

const containsItems = (obj: object, arrayProperty: string): boolean => {
  return obj && (obj[arrayProperty] || []).length > 0;
};

const utils = {
  getContactInformation: (organisationDetails: Partial<OrganisationDetails>): OrganisationContactInformation => {
    if (containsItems(organisationDetails, 'contactInformation')) {
      return organisationDetails.contactInformation[0];
    }
    return null;
  },
  getDxAddress: (contactInformation: Partial<OrganisationContactInformation>): DxAddress => {
    if (containsItems(contactInformation, 'dxAddress')) {
      return contactInformation.dxAddress[0];
    }
    return null;
  },
  getPaymentAccount: (organisationDetails: Partial<OrganisationDetails>): PBANumberModel[] => {
    if (containsItems(organisationDetails, 'paymentAccount')) {
      return organisationDetails.paymentAccount;
    }
    return null;
  },
  getPendingPaymentAccount: (organisationDetails: Partial<OrganisationDetails>): PBANumberModel[] => {
    if (containsItems(organisationDetails, 'pendingPaymentAccount')) {
      return organisationDetails.pendingPaymentAccount;
    }
    return null;
  }
};

export { utils };