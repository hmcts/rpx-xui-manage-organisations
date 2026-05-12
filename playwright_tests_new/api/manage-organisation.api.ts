import { test, expect } from './fixtures';
import type { OrganisationDetailsResponse, UserListResponse } from './utils/types';

test.describe('Manage Organisation API contracts', { tag: '@svc-manage-org' }, () => {
  test('returns authenticated organisation details', async ({ apiClient }) => {
    const response = await apiClient.get<OrganisationDetailsResponse>('api/organisation');

    expect(response.status, 'Organisation details should be returned for an authenticated user').toBe(200);
    expect(response.data, 'Organisation response should include identity, name, status and contact information').toEqual(
      expect.objectContaining({
        contactInformation: expect.any(Array),
        name: expect.any(String),
        organisationIdentifier: expect.any(String),
        status: expect.any(String)
      })
    );
  });

  test('returns authenticated legacy v1 organisation details', async ({ apiClient }) => {
    const response = await apiClient.get<OrganisationDetailsResponse>('api/organisation/v1');

    expect(response.status, 'Legacy v1 organisation details should be returned for an authenticated user').toBe(200);
    expect(response.data, 'Organisation v1 response should include identity, name and status').toEqual(
      expect.objectContaining({
        name: expect.any(String),
        organisationIdentifier: expect.any(String),
        status: expect.any(String)
      })
    );
  });

  test('keeps v1 and default organisation identifiers aligned', async ({ apiClient }) => {
    const defaultResponse = await apiClient.get<OrganisationDetailsResponse>('api/organisation');
    const v1Response = await apiClient.get<OrganisationDetailsResponse>('api/organisation/v1');

    expect(defaultResponse.status, 'Default organisation details should be returned').toBe(200);
    expect(v1Response.status, 'Legacy v1 organisation details should be returned').toBe(200);
    expect(v1Response.data, 'V1 and default organisation IDs should match').toEqual(
      expect.objectContaining({
        organisationIdentifier: defaultResponse.data.organisationIdentifier
      })
    );
  });

  test('returns authenticated organisation users', async ({ apiClient }) => {
    const response = await apiClient.get<UserListResponse>('api/allUserListWithoutRoles');
    const users = response.data.users;

    expect(response.status, 'Organisation users should be returned for an authenticated user').toBe(200);
    expect(users, 'Users response should include users').toEqual(expect.any(Array));
    expect(users?.length, 'At least one organisation user should be returned').toBeGreaterThan(0);
    expect(
      users?.some((user) => user.email && user.firstName && user.lastName && user.idamStatus),
      'At least one user should include identity and status fields'
    ).toBe(true);
  });

  test('rejects anonymous organisation details requests', async ({ anonymousClient }) => {
    const response = await anonymousClient.get('api/organisation', { throwOnError: false });

    expect([401, 403], 'Anonymous organisation details requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous legacy organisation details requests', async ({ anonymousClient }) => {
    const response = await anonymousClient.get('api/organisation/v1', { throwOnError: false });

    expect([401, 403], 'Anonymous legacy organisation details requests should be rejected').toContain(response.status);
  });
});
