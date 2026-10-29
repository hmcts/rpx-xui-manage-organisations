import { test, expect } from './fixtures';

test.describe('OGD flow API guardrails', { tag: '@svc-user-admin' }, () => {
  test('rejects anonymous OGD invite requests before creating a user', async ({ anonymousClient }) => {
    const response = await anonymousClient.post('api/ogd-flow/invite', {
      data: {
        orgIdsPayload: [],
        userPayload: {
          email: 'anonymous.ogd@example.invalid',
          firstName: 'Anonymous',
          lastName: 'User',
          roles: [],
          userAccessTypes: []
        }
      },
      throwOnError: false
    });

    expect([401, 403], 'Anonymous OGD invite requests should be rejected before processing').toContain(response.status);
  });

  test('rejects anonymous OGD update requests before changing permissions', async ({ anonymousClient }) => {
    const response = await anonymousClient.put('api/ogd-flow/update/anonymous-user-id', {
      data: {
        orgIdsPayload: [],
        userPayload: {
          rolesAdd: [],
          rolesDelete: [],
          userAccessTypes: []
        }
      },
      throwOnError: false
    });

    expect([401, 403], 'Anonymous OGD update requests should be rejected before processing').toContain(response.status);
  });
});
