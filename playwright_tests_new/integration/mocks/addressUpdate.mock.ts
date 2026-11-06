import type { RegisterOrganisationAddress } from './registerOrganisation.mock';
import { manageOrgIntegrationOrganisation, manageOrgIntegrationUserDetails } from './manageOrgIntegration.mock';

export const updatedUkAddress = {
  addressLine1: '44 Assurance Road',
  addressLine2: 'Suite 2',
  addressLine3: 'North Wing',
  postTown: 'Leeds',
  county: 'West Yorkshire',
  country: 'UK',
  postCode: 'LS1 2AB'
} satisfies RegisterOrganisationAddress;

export const updatedInternationalAddress = {
  addressLine1: '10 Rue de Rivoli',
  postTown: 'Paris',
  country: 'France'
} satisfies RegisterOrganisationAddress;

export const correctedUkAddress = { ...updatedUkAddress, addressLine1: '45 Assurance Road' };

export const addressUpdateDx = { dxNumber: '12345', dxExchange: 'Leeds' };
export const exchangeOnlyAddressUpdateDx = { ...addressUpdateDx, dxNumber: '' };

export const addressUpdateNonManager = {
  ...manageOrgIntegrationUserDetails,
  roles: manageOrgIntegrationUserDetails.roles.filter((role) => role !== 'pui-organisation-manager')
};

export const pendingAddressOrganisation = {
  ...manageOrgIntegrationOrganisation,
  pendingContactInformation: true
};

export const addressUpdatePaths = [
  '/organisation/update-address',
  '/organisation/update-address/document-exchange-reference',
  '/organisation/update-address/document-exchange-reference-details',
  '/organisation/update-address/check'
] as const;

export const addressUpdateCancellationStages = [
  { stage: 'address', path: addressUpdatePaths[0] },
  { stage: 'DX question', path: addressUpdatePaths[1] },
  { stage: 'DX details', path: addressUpdatePaths[2] },
  { stage: 'check', path: addressUpdatePaths[3] }
] as const;

export const addressUpdateSystemError = 'There was a system error and your request could not be processed. Please try again.';

export const expectedUkAddressOnlyUpdate = {
  addressLine1: updatedUkAddress.addressLine1,
  addressLine2: updatedUkAddress.addressLine2,
  addressLine3: updatedUkAddress.addressLine3,
  townCity: updatedUkAddress.postTown,
  county: updatedUkAddress.county,
  country: updatedUkAddress.country,
  postCode: updatedUkAddress.postCode
};

export const expectedUkAddressUpdate = { ...expectedUkAddressOnlyUpdate, ...addressUpdateDx };
export const expectedCorrectedUkAddressUpdate = {
  ...expectedUkAddressUpdate, addressLine1: correctedUkAddress.addressLine1
};
export const expectedInternationalAddressUpdate = {
  addressLine1: updatedInternationalAddress.addressLine1,
  townCity: updatedInternationalAddress.postTown,
  country: updatedInternationalAddress.country
};
export const maximumAddressUpdateDx = { dxNumber: 'D'.repeat(13), dxExchange: 'E'.repeat(40) };
export const partialAddressUpdateDxCases = [
  { name: 'number only', dxNumber: addressUpdateDx.dxNumber, dxExchange: '', message: 'Enter DX exchange' },
  { name: 'exchange only', dxNumber: '', dxExchange: addressUpdateDx.dxExchange, message: 'Enter DX number' }
] as const;
export const addressUpdateServiceDownStatuses = [401, 403, 502] as const;
export const historicalExchangeOnlyOrganisation = {
  ...pendingAddressOrganisation,
  contactInformation: [{
    ...manageOrgIntegrationOrganisation.contactInformation[0],
    dxAddress: [exchangeOnlyAddressUpdateDx]
  }]
};
