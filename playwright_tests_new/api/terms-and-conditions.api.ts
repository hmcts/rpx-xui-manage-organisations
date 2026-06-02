import { test, expect } from './fixtures';

test.describe('Terms and conditions API contracts', { tag: '@svc-terms' }, () => {
  test('rejects anonymous terms document requests', async ({ anonymousClient }) => {
    const response = await anonymousClient.get('api/termsAndConditions', { throwOnError: false });

    expect([401, 403], 'Anonymous terms document requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous terms acceptance requests before payload processing', async ({ anonymousClient }) => {
    const response = await anonymousClient.post('api/userTermsAndConditions', {
      data: { userId: 'anonymous-user-id' },
      throwOnError: false
    });

    expect([401, 403], 'Anonymous terms acceptance requests should be rejected').toContain(response.status);
  });
});
