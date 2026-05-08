import { test } from './fixtures';
import { expectStatus } from './utils/assertions';

const buildRegistrationPayload = () => {
  const uniqueSuffix = Date.now();

  return {
    fromValues: {
      haveDXNumber: 'dontHaveDX',
      orgName: `API Playwright Org ${uniqueSuffix}`,
      createButton: 'Continue',
      officeAddressOne: '102 Petty France',
      officeAddressTwo: '',
      townOrCity: 'London',
      county: null,
      postcode: 'SW1H 9AJ',
      PBAnumber1: null,
      PBAnumber2: null,
      haveDx: 'no',
      haveSra: 'no',
      firstName: 'Playwright',
      lastName: 'Api',
      emailAddress: `playwright.api.org.${uniqueSuffix}@mailnesia.com`
    },
    event: 'continue'
  };
};

test.describe('Register organisation API contracts', { tag: '@svc-registration' }, () => {
  test('submits registration payload when mutating API coverage is explicitly enabled', async ({ anonymousApiClient }) => {
    test.skip(
      process.env.MANAGE_ORG_API_ENABLE_REGISTRATION_POST !== 'true',
      'Registration POST creates AAT data, so it is opt-in until a cleanup contract is agreed.'
    );

    const response = await anonymousApiClient.post('external/register-org/register', {
      data: buildRegistrationPayload()
    });

    expectStatus(response.status, [200]);
  });
});
