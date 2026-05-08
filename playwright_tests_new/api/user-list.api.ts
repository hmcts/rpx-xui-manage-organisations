import { test, expect } from './fixtures';
import { expectArray, expectObject, expectStatus } from './utils/assertions';

type OrganisationUser = {
  email?: string;
  firstName?: string;
  idamStatus?: string;
  lastName?: string;
  roles?: string[];
  userIdentifier?: string;
};

type UserListResponse = {
  organisationIdentifier?: string;
  users?: OrganisationUser[];
};

const expectUserList = (responseData: UserListResponse | undefined, message: string): OrganisationUser[] => {
  const payload = expectObject(responseData, message) as UserListResponse;
  const users = expectArray<OrganisationUser>(payload.users, 'Users payload should include users array');
  expect(users.length, 'At least one user should be returned').toBeGreaterThan(0);
  expect(
    users.some((user) => user.email && user.firstName && user.lastName && user.userIdentifier),
    'At least one user should include identity fields'
  ).toBe(true);
  return users;
};

test.describe('User list API contracts', { tag: '@svc-user-admin' }, () => {
  test('returns paged user list with identity fields', async ({ apiClient }) => {
    const response = await apiClient.get<UserListResponse>('api/userList?pageNumber=1');

    expectStatus(response.status, [200]);
    expectUserList(response.data, 'Paged user list response should be an object');
  });

  test('returns full organisation user list without requiring role expansion', async ({ apiClient }) => {
    const response = await apiClient.get<UserListResponse>('api/allUserListWithoutRoles');

    expectStatus(response.status, [200]);
    expectUserList(response.data, 'All user list without roles response should be an object');
  });

  test('returns active organisation users from the organisation users endpoint', async ({ apiClient }) => {
    const response = await apiClient.get<OrganisationUser[]>('api/organisation/users');

    expectStatus(response.status, [200]);
    const users = expectArray<OrganisationUser>(response.data, 'Organisation users response should be an array');
    expect(users.length, 'At least one active organisation user should be returned').toBeGreaterThan(0);
    expect(
      users.every((user) => user.idamStatus === 'ACTIVE'),
      'Organisation users endpoint should only return active users'
    ).toBe(true);
  });

  test('returns selected user details by user identifier', async ({ apiClient }) => {
    const listResponse = await apiClient.get<UserListResponse>('api/allUserListWithoutRoles');
    expectStatus(listResponse.status, [200]);
    const users = expectUserList(listResponse.data, 'All user list without roles response should be an object');
    const targetUser = users.find((user) => user.userIdentifier);

    expect(targetUser?.userIdentifier, 'A user identifier should be available for details lookup').toBeTruthy();
    const detailsResponse = await apiClient.get<UserListResponse>(`api/user-details?userId=${targetUser?.userIdentifier}`);

    expectStatus(detailsResponse.status, [200]);
    const detailsUsers = expectUserList(detailsResponse.data, 'User details response should include users');
    expect(
      detailsUsers.some((user) => user.userIdentifier === targetUser?.userIdentifier),
      'User details response should include the requested user'
    ).toBe(true);
    expect(
      detailsUsers.some((user) => Array.isArray(user.roles)),
      'User details response should include role data'
    ).toBe(true);
  });

  test('rejects anonymous paged user list requests', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('api/userList?pageNumber=1');

    expectStatus(response.status, [401, 403]);
  });

  test('rejects anonymous full user list requests', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('api/allUserListWithoutRoles');

    expectStatus(response.status, [401, 403]);
  });
});
