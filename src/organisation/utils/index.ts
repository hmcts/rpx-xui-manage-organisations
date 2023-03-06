import { PBANumberModel } from 'src/models/pbaNumber.model';
import { DxAddress, OrganisationContactInformation, OrganisationDetails } from '../../models';
import { OrgManagerConstants } from '../organisation-constants';

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
  getPendingPaymentAccount: (organisationDetails: Partial<OrganisationDetails>): string[] => {
    if (containsItems(organisationDetails, 'pendingPaymentAccount')) {
      return organisationDetails.pendingPaymentAccount;
    }
    return null;
  },
  getErrorDuplicateHeaderMessage(pbaNumber: string) {
    return OrgManagerConstants.PBA_ERROR_ALREADY_USED_HEADER_MESSAGES[0].replace(OrgManagerConstants.PBA_MESSAGE_PLACEHOLDER, pbaNumber);
  },
  getErrorDuplicateMessage(pbaNumber: string) {
    return OrgManagerConstants.PBA_ERROR_ALREADY_USED_MESSAGES[0].replace(OrgManagerConstants.PBA_MESSAGE_PLACEHOLDER, pbaNumber);
  }
};

export { utils };
