import { test, expect } from './fixtures';
import type { ReferenceItem } from './types/api-contracts';

test.describe('Reference and configuration API contracts', { tag: '@svc-reference-data' }, () => {
  test('returns public health-check status without an authenticated session', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('api/healthCheck');

    expect(response.status, 'Health check should be publicly available').toBe(200);
    expect(response.data, 'Health-check response should be an object').toEqual(expect.any(Object));
  });

  test('returns public feature-configuration value without an authenticated session', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get<boolean>('api/configuration?configurationKey=termsAndConditionsEnabled');

    expect(response.status, 'Feature configuration should be publicly available').toBe(200);
    expect(typeof response.data, 'Feature configuration response should be boolean').toBe('boolean');
  });

  test('returns configured jurisdictions for authenticated users', async ({ apiClient }) => {
    const response = await apiClient.get<ReferenceItem[]>('api/jurisdictions');
    const jurisdictions = response.data;

    expect(response.status, 'Jurisdictions should be returned for an authenticated user').toBe(200);
    expect(response.data, 'Jurisdictions response should be an array').toEqual(expect.any(Array));
    expect(jurisdictions.length, 'At least one jurisdiction should be configured').toBeGreaterThan(0);
    expect(
      jurisdictions.every((jurisdiction) => jurisdiction.id),
      'Every jurisdiction should include an ID'
    ).toBe(true);
  });

  test('returns authenticated organisation types', async ({ apiClient }) => {
    const response = await apiClient.get<ReferenceItem[]>('api/organisationTypes');
    const organisationTypes = response.data;

    expect(response.status, 'Organisation types should be returned for an authenticated user').toBe(200);
    expect(response.data, 'Organisation types response should be an array').toEqual(expect.any(Array));
    expect(organisationTypes.length, 'At least one organisation type should be returned').toBeGreaterThan(0);
  });

  test('returns public UI configuration without an authenticated session', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('external/configuration-ui');

    expect(response.status, 'UI configuration should be publicly available').toBe(200);
    expect(response.data, 'Configuration UI response should include public runtime links and feature flags').toEqual(
      expect.objectContaining({
        idamWeb: expect.any(String),
        manageCaseLink: expect.any(String),
        manageOrgLink: expect.any(String),
        protocol: expect.any(String),
        termsAndConditionsEnabled: expect.any(Boolean)
      })
    );
  });

  test('returns public regulatory organisation types without an authenticated session', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get<ReferenceItem[]>('external/regulatoryOrganisationTypes');
    const organisationTypes = response.data;

    expect(response.status, 'Regulatory organisation types should be publicly available').toBe(200);
    expect(response.data, 'Regulatory organisation types response should be an array').toEqual(expect.any(Array));
    expect(organisationTypes.length, 'At least one regulatory organisation type should be returned').toBeGreaterThan(0);
  });

  test('rejects anonymous jurisdiction requests', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('api/jurisdictions');

    expect([401, 403], 'Anonymous jurisdiction requests should be rejected').toContain(response.status);
  });

  test('rejects anonymous authenticated organisation type requests', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('api/organisationTypes');

    expect([401, 403], 'Anonymous authenticated organisation type requests should be rejected').toContain(response.status);
  });
});
