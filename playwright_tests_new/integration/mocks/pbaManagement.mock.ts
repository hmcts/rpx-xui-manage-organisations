import {
  manageOrgIntegrationOrganisation,
  manageOrgIntegrationUserDetails
} from './manageOrgIntegration.mock';

export const pbaExistingAccount = 'PBA1234567';
export const pbaNewAccount = 'PBA7654321';
export const pbaInvalidAccount = 'PBAABC1234';

export const pbaFinanceUserDetails = {
  ...manageOrgIntegrationUserDetails,
  roles: [
    ...manageOrgIntegrationUserDetails.roles,
    'pui-finance-manager'
  ]
};

export const pbaManagementOrganisation = {
  ...manageOrgIntegrationOrganisation,
  paymentAccount: [pbaExistingAccount],
  pendingPaymentAccount: [] as string[],
  pendingAddPaymentAccount: [],
  pendingRemovePaymentAccount: []
};

export const pbaUpdateSuccessResponse = {
  code: 200,
  message: 'update successfully'
};
