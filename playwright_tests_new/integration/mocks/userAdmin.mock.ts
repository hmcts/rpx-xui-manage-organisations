import { manageOrgIntegrationOrganisationIdentifier } from './manageOrgIntegration.mock';

export const userAdminOrganisationProfileIds = [
  'SOLICITOR_PROFILE'
];

export const userAdminActiveUser = {
  userIdentifier: 'user-admin-active-user-id',
  firstName: 'Avery',
  lastName: 'Active',
  fullName: 'Avery Active',
  email: 'avery.active@example.com',
  idamStatus: 'ACTIVE',
  status: 'Active'
};

export const userAdminPendingUser = {
  userIdentifier: 'user-admin-pending-user-id',
  firstName: 'Parker',
  lastName: 'Pending',
  fullName: 'Parker Pending',
  email: 'parker.pending@example.com',
  idamStatus: 'PENDING',
  status: 'Pending'
};

export const userAdminActiveUserRoles = [
  'pui-organisation-manager',
  'pui-user-manager'
];

export const userAdminActiveUserAccessTypes = [
  {
    accessTypeId: 'CIVIL_STANDARD',
    enabled: false,
    jurisdictionId: 'CIVIL',
    organisationProfileId: userAdminOrganisationProfileIds[0]
  },
  {
    accessTypeId: 'CIVIL_FINANCE',
    enabled: true,
    jurisdictionId: 'CIVIL',
    organisationProfileId: userAdminOrganisationProfileIds[0]
  }
];

export const userAdminPendingUserRoles = [
  'pui-user-manager'
];

export const userAdminActiveUserDetails = {
  ...userAdminActiveUser,
  accessTypes: [],
  userAccessTypes: userAdminActiveUserAccessTypes,
  roles: userAdminActiveUserRoles
};

export const userAdminPendingUserDetails = {
  ...userAdminPendingUser,
  accessTypes: [],
  userAccessTypes: [],
  roles: userAdminPendingUserRoles
};

export const userAdminUsersWithoutRolesResponse = {
  organisationIdentifier: manageOrgIntegrationOrganisationIdentifier,
  organisationProfileIds: userAdminOrganisationProfileIds,
  users: [
    {
      ...userAdminActiveUser,
      userAccessTypes: userAdminActiveUserAccessTypes
    },
    userAdminPendingUser
  ]
};

export const userAdminJurisdictionsResponse = [
  { id: 'CIVIL' },
  { id: 'DIVORCE' },
  { id: 'PROBATE' }
];

export const inviteUserFormData = {
  firstName: 'Casey',
  lastName: 'Invite',
  email: 'casey.invite@example.com'
};

export const editUserPermissionsSuccessResponse = {
  roleAdditionResponse: {
    idamStatusCode: '201',
    idamMessage: 'User roles added'
  },
  roleDeletionResponse: [
    {
      roleName: 'pui-user-manager',
      idamStatusCode: '204',
      idamMessage: 'User role deleted'
    }
  ],
  statusUpdateResponse: null
};

export const userAdminAccessTypesResponse = {
  jurisdictions: [
    {
      jurisdictionId: 'CIVIL',
      jurisdictionName: 'Civil',
      accessTypes: [
        {
          accessTypeId: 'CIVIL_STANDARD',
          accessDefault: false,
          accessMandatory: false,
          description: 'Civil standard access',
          display: true,
          displayOrder: 1,
          hint: 'Allows standard civil case access',
          organisationProfileId: userAdminOrganisationProfileIds[0]
        },
        {
          accessTypeId: 'CIVIL_FINANCE',
          accessDefault: false,
          accessMandatory: false,
          description: 'Civil finance access',
          display: true,
          displayOrder: 2,
          hint: 'Allows finance-related civil case access',
          organisationProfileId: userAdminOrganisationProfileIds[0]
        }
      ]
    }
  ]
};

export const expectedCcdCaseworkerRoles = [
  'caseworker',
  'caseworker-divorce',
  'caseworker-divorce-solicitor',
  'caseworker-divorce-financialremedy',
  'caseworker-divorce-financialremedy-solicitor',
  'caseworker-probate',
  'caseworker-ia',
  'caseworker-probate-solicitor',
  'caseworker-publiclaw',
  'caseworker-ia-legalrep-solicitor',
  'caseworker-publiclaw-solicitor',
  'caseworker-civil',
  'caseworker-civil-solicitor',
  'caseworker-employment',
  'caseworker-employment-legalrep-solicitor',
  'caseworker-privatelaw',
  'caseworker-privatelaw-solicitor'
];
