import { test, expect } from './fixtures';
import type { FeeAccount, OrganisationDetailsResponse } from './utils/types';

test.describe('Fee account API contracts', { tag: '@svc-fee-accounts' }, () => {
  test('returns fee account details for an organisation payment account when one is configured', async ({ apiClient }) => {
    const organisationResponse = await apiClient.get<OrganisationDetailsResponse>('api/organisation');
    const paymentAccount = organisationResponse.data.paymentAccount?.find((account) => /^PBA\d+$/.test(account));

    expect(organisationResponse.status, 'Organisation details should be returned before fee account lookup').toBe(200);
    test.skip(!paymentAccount, 'The configured organisation has no PBA account to look up.');

    const response = await apiClient.get<FeeAccount[]>(`api/accounts?accountNames=${paymentAccount}`, {
      throwOnError: false
    });
    const [account] = response.data;

    expect([200, 404], 'Fee account lookup should return either account details or the existing missing-account contract').toContain(
      response.status
    );
    expect(response.data, 'Fee account lookup response should be an array').toEqual(expect.any(Array));
    expect(response.data.length, 'Fee account lookup should return one account result for one account request').toBe(1);
    expect(account, 'Fee account response should preserve the requested account number and balance shape').toEqual(
      expect.objectContaining({
        account_number: paymentAccount,
        available_balance: expect.any(Number)
      })
    );
  });
});
