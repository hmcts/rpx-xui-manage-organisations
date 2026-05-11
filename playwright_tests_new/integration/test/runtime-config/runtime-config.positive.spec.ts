import { expect, test } from '@playwright/test';
import type { RuntimeConfiguration } from '../../../api/types/api-contracts';

test.describe('Manage Org deployed runtime configuration', { tag: '@integration-runtime-config' }, () => {
  test('serves public UI configuration from the node layer', async ({ request }) => {
    const response = await request.get('/external/configuration-ui/');
    expect(response.status()).toBe(200);

    const configuration = await response.json() as RuntimeConfiguration;
    expect(configuration).toEqual(expect.objectContaining({
      idamWeb: expect.any(String),
      manageCaseLink: expect.any(String),
      manageOrgLink: expect.any(String),
      protocol: expect.any(String),
      termsAndConditionsEnabled: expect.any(Boolean)
    }));
    expect(configuration.idamWeb).toMatch(/^https?:\/\//);
    expect(configuration.manageOrgLink).toMatch(/^https?:\/\//);
  });
});
