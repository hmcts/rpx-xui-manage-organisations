import { test, expect } from './fixtures';
import type { FeeAccount, OrganisationDetailsResponse } from './utils/types';

const unknownPaymentAccount = 'PBA0000000';
const missingAccountMessage = 'Account not found';

test.describe('Fee account API contracts', { tag: '@svc-fee-accounts' }, () => {
  test('returns fee account details for an organisation payment account when the fee account service recognises it', async ({
    apiClient
  }) => {
    const organisationResponse = await apiClient.get<OrganisationDetailsResponse>('api/organisation');
    const paymentAccount = organisationResponse.data.paymentAccount?.find((account) => /^PBA\d+$/.test(account));

    expect(organisationResponse.status, 'Organisation details should be returned before fee account lookup').toBe(200);
    test.skip(!paymentAccount, 'The configured organisation has no PBA account to look up.');

    const response = await apiClient.get<FeeAccount[]>(`api/accounts?accountNames=${paymentAccount}`, {
      throwOnError: false
    });

    test.skip(
      response.status === 404,
      `The configured organisation PBA ${paymentAccount} is not recognised by the fee account service in this environment.`
    );
    expect(response.status, 'Recognised organisation payment accounts should return fee account details').toBe(200);
    expect(response.data, 'Fee account lookup response should be an array').toEqual(expect.any(Array));
    const [account] = response.data;

    expect(response.data.length, 'Fee account lookup should return one account result for one account request').toBe(1);
    expect(account, 'Fee account response should preserve the requested account number and balance shape').toEqual(
      expect.objectContaining({
        account_number: paymentAccount,
        available_balance: expect.any(Number)
      })
    );
  });

  test('returns the missing-account contract for an unknown payment account', async ({ apiClient }) => {
    const response = await apiClient.get<string[]>(`api/accounts?accountNames=${unknownPaymentAccount}`, {
      throwOnError: false
    });

    expect(response.status, 'Unknown fee account lookups should use the missing-account status').toBe(404);
    expect(response.data, 'Missing-account lookup response should be an array').toEqual(expect.any(Array));
    const [account] = response.data;

    expect(response.data.length, 'Missing-account lookup should return one result for one account request').toBe(1);
    expect(account, 'Missing-account response should preserve the current node API error message').toBe(missingAccountMessage);
  });
});
