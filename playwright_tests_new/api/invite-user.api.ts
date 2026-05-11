import { test, expect } from './fixtures';

const buildInvitePayload = (email: string, resendInvite: boolean) => ({
  firstName: 'Playwright',
  lastName: 'Api',
  email,
  roles: ['pui-case-manager'],
  resendInvite
});

test.describe('Invite user API contracts', { tag: '@svc-user-admin' }, () => {
  test('invites a user and handles re-invite response', async ({ apiClient, xsrfHeaders }) => {
    test.skip(
      process.env.MANAGE_ORG_API_ENABLE_INVITE_POST !== 'true',
      'Invite POST creates AAT user data, so it is opt-in until a cleanup contract is agreed.'
    );

    const email = `playwright.api.${Date.now()}@mailnesia.com`;
    const inviteResponse = await apiClient.post('api/inviteUser', {
      data: buildInvitePayload(email, false),
      headers: xsrfHeaders
    });

    expect(inviteResponse.status, 'Invite request should succeed').toBe(200);

    const reInviteResponse = await apiClient.post('api/inviteUser', {
      data: buildInvitePayload(email, true),
      headers: xsrfHeaders
    });

    expect([200, 429], 'Re-invite should either succeed or respect the existing rate limit').toContain(
      reInviteResponse.status
    );
  });

  test('rejects anonymous invite requests', async ({ anonymousClient }) => {
    const response = await anonymousClient.post('api/inviteUser', {
      data: buildInvitePayload(`anonymous.playwright.api.${Date.now()}@mailnesia.com`, false)
    });

    expect([401, 403], 'Anonymous invite requests should be rejected').toContain(response.status);
  });
});
