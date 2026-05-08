import { test, expect } from './fixtures';
import { expectArray, expectObject, expectStatus } from './utils/assertions';

type UserSessionResponse = {
  email?: string;
  orgId?: string;
  roles?: string[];
  sessionTimeout?: unknown;
  userId?: string;
};

test.describe('User session API contracts', { tag: '@svc-user-session' }, () => {
  test('returns authenticated user identity, roles, and organisation context', async ({ apiClient }) => {
    const response = await apiClient.get<UserSessionResponse>('api/user/details');

    expectStatus(response.status, [200]);
    const user = expectObject(response.data, 'User details response should be an object') as UserSessionResponse;
    expect(user.email, 'User email should be present').toContain('@');
    expect(user.userId, 'User ID should be present').toBeTruthy();
    expect(user.orgId, 'Organisation ID should be present').toBeTruthy();
    expectArray(user.roles, 'User roles should be an array');
    expect(user.sessionTimeout, 'Session timeout config should be present').toBeTruthy();
  });

  test('returns current user terms acceptance state', async ({ apiClient }) => {
    const userResponse = await apiClient.get<UserSessionResponse>('api/user/details');
    expectStatus(userResponse.status, [200]);
    const user = expectObject(userResponse.data, 'User details response should be an object') as UserSessionResponse;

    const response = await apiClient.get<boolean>(`api/userTermsAndConditions/${user.userId}`);

    expectStatus(response.status, [200]);
    expect(typeof response.data, 'User terms acceptance should be boolean').toBe('boolean');
  });

  test('rejects anonymous user session requests', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('api/user/details');

    expectStatus(response.status, [401, 403]);
  });

  test('rejects anonymous terms and conditions state requests', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('api/userTermsAndConditions/anonymous-user-id');

    expectStatus(response.status, [401, 403]);
  });
});
