import { test, expect } from './fixtures';
import type { ManageOrgUser, UserListResponse } from './utils/types';

test.describe('User list API contracts', { tag: '@svc-user-admin' }, () => {
  test('returns paged user list with identity fields', async ({ apiClient }) => {
    const response = await apiClient.get<UserListResponse>('api/userList?pageNumber=1');
    const users = response.data.users;

    expect(response.status, 'Paged user list should be returned for an authenticated user').toBe(200);
    expect(users, 'Paged user list response should include users array').toEqual(expect.any(Array));
    expect(users?.length, 'At least one user should be returned').toBeGreaterThan(0);
    expect(
      users?.some((user) => user.email && user.firstName && user.lastName && user.userIdentifier),
      'At least one user should include identity fields'
    ).toBe(true);
  });

  test('returns full organisation user list without requiring role expansion', async ({ apiClient }) => {
    const response = await apiClient.get<UserListResponse>('api/allUserListWithoutRoles');
    const users = response.data.users;
    const activeUser = users?.find((user) => user.email && user.firstName && user.lastName && user.idamStatus === 'ACTIVE');

    expect(response.status, 'Full organisation user list should be returned for an authenticated user').toBe(200);
    expect(users, 'All user list without roles response should include users array').toEqual(expect.any(Array));
    expect(users?.length, 'At least one user should be returned').toBeGreaterThan(0);
    expect(activeUser, 'At least one active user should include identity fields').toEqual(
      expect.objectContaining({
        email: expect.stringMatching(/^[^@\s]+@[^@\s]+\.[^@\s]+$/),
        firstName: expect.any(String),
        idamStatus: 'ACTIVE',
        lastName: expect.any(String)
      })
    );
    expect(activeUser?.firstName, 'Active user first name should not be empty').not.toHaveLength(0);
    expect(activeUser?.lastName, 'Active user last name should not be empty').not.toHaveLength(0);
  });

  test('returns active organisation users from the organisation users endpoint', async ({ apiClient }) => {
    const response = await apiClient.get<ManageOrgUser[]>('api/organisation/users');
    const users = response.data;

    expect(response.status, 'Organisation users should be returned for an authenticated user').toBe(200);
    expect(response.data, 'Organisation users response should be an array').toEqual(expect.any(Array));
    expect(users.length, 'At least one active organisation user should be returned').toBeGreaterThan(0);
    expect(
      users.every((user) => user.idamStatus === 'ACTIVE'),
      'Organisation users endpoint should only return active users'
    ).toBe(true);
  });

  test('returns selected user details by user identifier', async ({ apiClient }) => {
    const listResponse = await apiClient.get<UserListResponse>('api/allUserListWithoutRoles');
    const users = listResponse.data.users;

    expect(listResponse.status, 'Full organisation user list should be returned for details lookup').toBe(200);
    expect(users, 'All user list without roles response should include users array').toEqual(expect.any(Array));
    expect(users?.length, 'At least one user should be returned').toBeGreaterThan(0);
    const targetUser = users.find((user) => user.userIdentifier);

    expect(targetUser?.userIdentifier, 'A user identifier should be available for details lookup').toBeTruthy();
    const detailsResponse = await apiClient.get<UserListResponse>(`api/user-details?userId=${targetUser?.userIdentifier}`);
    const detailsUsers = detailsResponse.data.users;

    expect(detailsResponse.status, 'User details should be returned for the selected user').toBe(200);
    expect(detailsUsers, 'User details response should include users').toEqual(expect.any(Array));
    expect(detailsUsers?.length, 'User details response should include at least one user').toBeGreaterThan(0);
    expect(
      detailsUsers?.some((user) => user.userIdentifier === targetUser?.userIdentifier),
      'User details response should include the requested user'
    ).toBe(true);
    expect(
      detailsUsers?.some((user) => Array.isArray(user.roles)),
      'User details response should include role data'
    ).toBe(true);
  });

  test('rejects anonymous paged user list requests', async ({ anonymousClient }) => {
    const response = await anonymousClient.get('api/userList?pageNumber=1', { throwOnError: false });

    expect([401, 403], 'Anonymous paged user list requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous full user list requests', async ({ anonymousClient }) => {
    const response = await anonymousClient.get('api/allUserListWithoutRoles', { throwOnError: false });

    expect([401, 403], 'Anonymous full user list requests should be rejected').toContain(response.status);
  });
});
