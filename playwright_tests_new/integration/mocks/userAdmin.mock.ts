import { manageOrgIntegrationOrganisationIdentifier } from './manageOrgIntegration.mock';

export const userAdminActiveUser = {
  userIdentifier: 'user-admin-active-user-id',
  firstName: 'Avery',
  lastName: 'Active',
  fullName: 'Avery Active',
  email: 'avery.active@example.com',
  idamStatus: 'ACTIVE',
  status: 'active'
};

export const userAdminPendingUser = {
  userIdentifier: 'user-admin-pending-user-id',
  firstName: 'Parker',
  lastName: 'Pending',
  fullName: 'Parker Pending',
  email: 'parker.pending@example.com',
  idamStatus: 'PENDING',
  status: 'pending'
};

export const userAdminUsersWithoutRolesResponse = {
  organisationIdentifier: manageOrgIntegrationOrganisationIdentifier,
  users: [
    userAdminActiveUser,
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
