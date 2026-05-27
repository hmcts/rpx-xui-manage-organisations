import { test, expect } from './fixtures';
import type { MutatingApiResult, OrganisationDetailsResponse } from './utils/types';

const noSelectedCasesPayload = {
  sharedCases: []
};

const noPaymentAccountChangesPayload = {
  pendingPaymentAccount: {
    pendingAddPaymentAccount: [],
    pendingRemovePaymentAccount: []
  }
};

test.describe('Cleanup-safe mutating API contracts', { tag: '@svc-mutating-api' }, () => {
  test('accepts a case-share assignment submission with no selected cases and returns an empty result', async ({
    apiClient,
    xsrfHeaders
  }) => {
    const response = await apiClient.post<[]>('api/caseshare/case-assignments', {
      data: noSelectedCasesPayload,
      headers: xsrfHeaders
    });

    expect(response.status, 'No-op case-share assignment submissions should be accepted').toBe(201);
    expect(response.data, 'No selected cases should produce an empty assignment result').toEqual([]);
  });

  test('accepts a PBA add-delete submission with no account changes and keeps organisation accounts unchanged', async ({
    apiClient,
    xsrfHeaders
  }) => {
    const beforeResponse = await apiClient.get<OrganisationDetailsResponse>('api/organisation');
    const beforeAccounts = beforeResponse.data.paymentAccount ?? [];

    const updateResponse = await apiClient.post<MutatingApiResult>('api/pba/addDeletePBA', {
      data: noPaymentAccountChangesPayload,
      headers: xsrfHeaders
    });

    const afterResponse = await apiClient.get<OrganisationDetailsResponse>('api/organisation');

    expect(beforeResponse.status, 'Organisation details should be available before the no-op PBA update').toBe(200);
    expect(updateResponse.status, 'No-op PBA add-delete submissions should complete through the mutation route').toBe(202);
    expect(updateResponse.data, 'No-op PBA add-delete response should use the existing delete-only success contract').toEqual({
      code: 202,
      message: 'delete successfully'
    });
    expect(afterResponse.status, 'Organisation details should be available after the no-op PBA update').toBe(200);
    expect(afterResponse.data.paymentAccount ?? [], 'No-op PBA update should not change organisation payment accounts').toEqual(
      beforeAccounts
    );
  });
});
