import { test, expect } from './fixtures';
import { expectArray, expectObject, expectStatus } from './utils/assertions';

type OrganisationResponse = {
  contactInformation?: unknown[];
  name?: string;
  organisationIdentifier?: string;
  status?: string;
};

type OrganisationUser = {
  email?: string;
  firstName?: string;
  idamStatus?: string;
  lastName?: string;
};

type UserListResponse = {
  users?: OrganisationUser[];
};

test.describe('Manage Organisation API contracts', { tag: '@svc-manage-org' }, () => {
  test('returns authenticated organisation details', async ({ apiClient }) => {
    const response = await apiClient.get<OrganisationResponse>('api/organisation');

    expectStatus(response.status, [200]);
    const organisation = expectObject(response.data, 'Organisation response should be an object') as OrganisationResponse;
    expect(organisation.organisationIdentifier, 'Organisation identifier should be present').toBeTruthy();
    expect(organisation.name, 'Organisation name should be present').toBeTruthy();
    expect(organisation.status, 'Organisation status should be present').toBeTruthy();
    expectArray(organisation.contactInformation, 'Organisation contact information should be an array');
  });

  test('returns authenticated organisation users', async ({ apiClient }) => {
    const response = await apiClient.get<UserListResponse>('api/allUserListWithoutRoles');

    expectStatus(response.status, [200]);
    const users = expectArray<OrganisationUser>(response.data?.users, 'Users response should include users');
    expect(users.length, 'At least one organisation user should be returned').toBeGreaterThan(0);
    expect(
      users.some((user) => user.email && user.firstName && user.lastName && user.idamStatus),
      'At least one user should include identity and status fields'
    ).toBe(true);
  });

  test('rejects anonymous organisation details requests', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('api/organisation');

    expectStatus(response.status, [401, 403]);
  });
});
