import { test, expect } from './fixtures';
import type { FeeAccount, OrganisationDetailsResponse } from './utils/types';

const unknownPaymentAccount = 'PBA0000000';

test.describe('Fee account API contracts', { tag: '@svc-fee-accounts' }, () => {
  test('returns fee account details for an organisation payment account when the fee account service recognises it', async ({
    apiClient
  }) => {
    const organisationResponse = await apiClient.get<OrganisationDetailsResponse>('api/organisation');

    expect(organisationResponse.status, 'Organisation details should be returned before fee account lookup').toBe(200);
    const paymentAccounts = organisationResponse.data.paymentAccount;
    expect(paymentAccounts, 'Organisation details should include payment accounts for fee account lookup').toEqual(
      expect.any(Array)
    );
    const paymentAccount = paymentAccounts!.find((account) => /^PBA\d+$/.test(account));
    expect(paymentAccount, 'The configured organisation should include a PBA account to look up').toBeTruthy();

    const response = await apiClient.get<FeeAccount[]>(`api/accounts?accountNames=${paymentAccount}`, {
      throwOnError: false
    });
    const seededFeeAccountFailureMessage =
      `Configured organisation PBA ${paymentAccount} should be recognised by the fee account service.`;

    expect(response.status, seededFeeAccountFailureMessage).toBe(200);
    expect(response.data, 'Fee account lookup response should be an array').toEqual(expect.any(Array));
    expect(response.data.length, 'Fee account lookup should return one account result for one account request').toBe(1);
    const [account] = response.data;

    expect(account, 'Fee account response should preserve the requested account number and balance shape').toEqual(
      expect.objectContaining({
        account_number: paymentAccount,
        available_balance: expect.any(Number)
      })
    );
  });

  test('returns the missing-account contract for an unknown payment account', async ({ apiClient }) => {
    const response = await apiClient.get<Array<string | Record<string, unknown>>>(
      `api/accounts?accountNames=${unknownPaymentAccount}`,
      {
        throwOnError: false
      }
    );

    expect(response.status, 'Unknown fee account lookups should use the missing-account status').toBe(404);
    expect(response.data, 'Missing-account lookup response should be an array').toEqual(expect.any(Array));
    expect(response.data.length, 'Missing-account lookup should return one result for one account request').toBe(1);
    const [account] = response.data;

    expect(account, 'Missing-account response should include an upstream error entry').toBeTruthy();
    if (typeof account === 'string') {
      expect(account.trim().length, 'String missing-account responses should not be empty').toBeGreaterThan(0);
      return;
    }

    expect(
      Object.keys(account).length,
      'Object missing-account responses should include upstream error details'
    ).toBeGreaterThan(0);
  });
});
