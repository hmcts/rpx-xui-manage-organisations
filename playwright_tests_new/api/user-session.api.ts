import { test, expect } from './fixtures';
import type { UserSessionResponse } from './utils/types';

test.describe('User session API contracts', { tag: '@svc-user-session' }, () => {
  test('returns authenticated user identity, roles, and organisation context', async ({ apiClient }) => {
    const response = await apiClient.get('api/user/details');

    expect(response.status, 'User details should be returned for an authenticated user').toBe(200);
    expect(response.data, 'User details response should include identity, roles and session timeout').toEqual(
      expect.objectContaining({
        email: expect.stringContaining('@'),
        orgId: expect.any(String),
        roles: expect.any(Array),
        sessionTimeout: expect.anything(),
        userId: expect.any(String)
      })
    );
  });

  test('returns current user terms acceptance state', async ({ apiClient }) => {
    const userResponse = await apiClient.get<UserSessionResponse>('api/user/details');
    const user = userResponse.data;

    expect(userResponse.status, 'User details should be returned before terms lookup').toBe(200);
    expect(user.userId, 'User ID should be present for terms lookup').toEqual(expect.any(String));
    const response = await apiClient.get<boolean>(`api/userTermsAndConditions/${user.userId}`);

    expect(response.status, 'User terms state should be returned for the current user').toBe(200);
    expect(typeof response.data, 'User terms acceptance should be boolean').toBe('boolean');
  });

  test('rejects anonymous user session requests', async ({ anonymousClient }) => {
    const response = await anonymousClient.get('api/user/details', { throwOnError: false });

    expect([401, 403], 'Anonymous user session requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous terms and conditions state requests', async ({ anonymousClient }) => {
    const response = await anonymousClient.get('api/userTermsAndConditions/anonymous-user-id', { throwOnError: false });

    expect([401, 403], 'Anonymous terms and conditions state requests should be rejected').toContain(response.status);
  });
});
