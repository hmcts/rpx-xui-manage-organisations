import { test, expect } from './fixtures';
import { expectArray, expectObject, expectStatus } from './utils/assertions';

type Jurisdiction = {
  id?: string;
};

type ConfigurationUiResponse = {
  idamWeb?: string;
  launchDarklyClientId?: string;
  manageCaseLink?: string;
  manageOrgLink?: string;
  protocol?: string;
  termsAndConditionsEnabled?: boolean;
};

type OrganisationType = {
  key?: string;
  value?: string;
};

test.describe('Reference and configuration API contracts', { tag: '@svc-reference-data' }, () => {
  test('returns public health-check status without an authenticated session', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('api/healthCheck');

    expectStatus(response.status, [200]);
    expectObject(response.data, 'Health-check response should be an object');
  });

  test('returns public feature-configuration value without an authenticated session', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get<boolean>('api/configuration?configurationKey=termsAndConditionsEnabled');

    expectStatus(response.status, [200]);
    expect(typeof response.data, 'Feature configuration response should be boolean').toBe('boolean');
  });

  test('returns configured jurisdictions for authenticated users', async ({ apiClient }) => {
    const response = await apiClient.get<Jurisdiction[]>('api/jurisdictions');

    expectStatus(response.status, [200]);
    const jurisdictions = expectArray<Jurisdiction>(response.data, 'Jurisdictions response should be an array');
    expect(jurisdictions.length, 'At least one jurisdiction should be configured').toBeGreaterThan(0);
    expect(
      jurisdictions.every((jurisdiction) => jurisdiction.id),
      'Every jurisdiction should include an ID'
    ).toBe(true);
  });

  test('returns authenticated organisation types', async ({ apiClient }) => {
    const response = await apiClient.get<OrganisationType[]>('api/organisationTypes');

    expectStatus(response.status, [200]);
    const organisationTypes = expectArray<OrganisationType>(response.data, 'Organisation types response should be an array');
    expect(organisationTypes.length, 'At least one organisation type should be returned').toBeGreaterThan(0);
  });

  test('returns public UI configuration without an authenticated session', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get<ConfigurationUiResponse>('external/configuration-ui');

    expectStatus(response.status, [200]);
    const configuration = expectObject(response.data, 'Configuration UI response should be an object') as ConfigurationUiResponse;
    expect(configuration.idamWeb, 'IDAM web URL should be present').toBeTruthy();
    expect(configuration.manageCaseLink, 'Manage case link should be present').toBeTruthy();
    expect(configuration.manageOrgLink, 'Manage org link should be present').toBeTruthy();
    expect(configuration.protocol, 'Protocol should be present').toBeTruthy();
    expect(typeof configuration.termsAndConditionsEnabled, 'Terms feature flag should be boolean').toBe('boolean');
  });

  test('returns public regulatory organisation types without an authenticated session', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get<OrganisationType[]>('external/regulatoryOrganisationTypes');

    expectStatus(response.status, [200]);
    const organisationTypes = expectArray<OrganisationType>(response.data, 'Regulatory organisation types response should be an array');
    expect(organisationTypes.length, 'At least one regulatory organisation type should be returned').toBeGreaterThan(0);
  });

  test('rejects anonymous jurisdiction requests', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('api/jurisdictions');

    expectStatus(response.status, [401, 403]);
  });

  test('rejects anonymous authenticated organisation type requests', async ({ anonymousApiClient }) => {
    const response = await anonymousApiClient.get('api/organisationTypes');

    expectStatus(response.status, [401, 403]);
  });
});
