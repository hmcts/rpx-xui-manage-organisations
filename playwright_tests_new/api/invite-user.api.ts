import { test, expect } from './fixtures';

const buildInvitePayload = (email: string, resendInvite: boolean) => ({
  firstName: 'Playwright',
  lastName: 'Api',
  email,
  roles: ['pui-case-manager'],
  resendInvite
});

test.describe('Invite user API contracts', { tag: '@svc-user-admin' }, () => {
  test('rejects anonymous invite requests', async ({ anonymousClient }) => {
    const response = await anonymousClient.post('api/inviteUser', {
      data: buildInvitePayload(`anonymous.playwright.api.${Date.now()}@mailnesia.com`, false),
      throwOnError: false
    });

    expect([401, 403], 'Anonymous invite requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous re-invite requests before invite processing', async ({ anonymousClient }) => {
    const response = await anonymousClient.post('api/inviteUser', {
      data: buildInvitePayload(`anonymous.reinvite.playwright.api.${Date.now()}@mailnesia.com`, true),
      throwOnError: false
    });

    expect([401, 403], 'Anonymous re-invite requests should be rejected before processing').toContain(response.status);
  });
});
