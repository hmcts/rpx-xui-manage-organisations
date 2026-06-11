import { petSolicitorOne, petSolicitorTwo } from './caseSharingUsers.mock';

export const manageOrgIntegrationOrganisationIdentifier = 'NPT8F21';
export const manageOrgIntegrationOrganisationName = 'Manage Org Integration Solicitors';

export const manageOrgRuntimeConfiguration = {
  idamWeb: 'https://idam.manage-org.integration.mock',
  launchDarklyClientId: 'manage-org-integration-client-id',
  manageCaseLink: 'https://manage-case.manage-org.integration.mock',
  manageOrgLink: 'http://localhost:4200',
  protocol: 'http',
  googleAnalyticsKey: '',
  termsAndConditionsEnabled: false
};

export const manageOrgIntegrationUserDetails = {
  email: 'manage-org.integration.admin@example.com',
  orgId: manageOrgIntegrationOrganisationIdentifier,
  roles: [
    'pui-caa',
    'pui-case-manager',
    'pui-finance-manager',
    'pui-org-manager',
    'pui-organisation-manager',
    'pui-user-manager',
    'task-supervisor',
    'case-allocator'
  ],
  sessionTimeout: {
    idleModalDisplayTime: 10,
    totalIdleTime: 20
  },
  userId: 'manage-org-integration-admin-id'
};

export const manageOrgIntegrationOrganisation = {
  name: manageOrgIntegrationOrganisationName,
  organisationIdentifier: manageOrgIntegrationOrganisationIdentifier,
  organisationProfileIds: [],
  contactInformation: [
    {
      addressLine1: '102 Petty France',
      addressLine2: 'Government Buildings',
      townCity: 'London',
      county: 'Greater London',
      postCode: 'SW1H 9AJ',
      dxAddress: [
        {
          dxNumber: 'DX 123456',
          dxExchange: 'Westminster 2'
        }
      ]
    }
  ],
  orgType: 'SolicitorOrganisation',
  orgAttributes: [
    {
      key: 'regulator.0',
      value: JSON.stringify({
        organisationRegistrationNumber: 'SRA123456',
        regulatorType: 'Solicitor Regulation Authority (SRA)'
      })
    }
  ],
  status: 'ACTIVE',
  sraId: 'SRA123456',
  sraRegulated: true,
  superUser: {
    firstName: 'Manage',
    lastName: 'Org',
    email: manageOrgIntegrationUserDetails.email
  },
  paymentAccount: ['PBA1234567'],
  pendingPaymentAccount: ['PBA7654321'],
  pendingAddPaymentAccount: [],
  pendingRemovePaymentAccount: []
};

export const manageOrgUsersWithoutRolesResponse = {
  organisationIdentifier: manageOrgIntegrationOrganisationIdentifier,
  users: [
    {
      userIdentifier: manageOrgIntegrationUserDetails.userId,
      firstName: 'Manage',
      lastName: 'Org',
      fullName: 'Manage Org',
      email: manageOrgIntegrationUserDetails.email,
      idamStatus: 'ACTIVE',
      status: 'active'
    },
    {
      userIdentifier: petSolicitorOne.idamId,
      firstName: petSolicitorOne.firstName,
      lastName: petSolicitorOne.lastName,
      fullName: `${petSolicitorOne.firstName} ${petSolicitorOne.lastName}`,
      email: petSolicitorOne.email,
      idamStatus: 'ACTIVE',
      status: 'active'
    },
    {
      userIdentifier: petSolicitorTwo.idamId,
      firstName: petSolicitorTwo.firstName,
      lastName: petSolicitorTwo.lastName,
      fullName: `${petSolicitorTwo.firstName} ${petSolicitorTwo.lastName}`,
      email: petSolicitorTwo.email,
      idamStatus: 'ACTIVE',
      status: 'active'
    }
  ]
};
