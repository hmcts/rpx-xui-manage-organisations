import { test as base } from '@playwright/test';
import { createAnonymousApiClient, createAuthenticatedApiClient, type ManageOrgApiClient } from './utils/api-client';
import { ensureApiStorageState, resolveApiStorageStatePath, xsrfHeadersFromStorageState } from './utils/api-auth';

type ApiFixtures = {
  anonymousClient: ManageOrgApiClient;
  apiClient: ManageOrgApiClient;
  xsrfHeaders: Record<string, string>;
};

export const test = base.extend<ApiFixtures>({
  // eslint-disable-next-line no-empty-pattern
  anonymousClient: async ({}, use) => {
    const client = await createAnonymousApiClient();
    await use(client);
    await client.dispose();
  },
  // eslint-disable-next-line no-empty-pattern
  apiClient: async ({}, use, testInfo) => {
    const client = await createAuthenticatedApiClient(testInfo.workerIndex);
    await use(client);
    await client.dispose();
  },
  // eslint-disable-next-line no-empty-pattern
  xsrfHeaders: async ({}, use, testInfo) => {
    await ensureApiStorageState(testInfo.workerIndex);
    await use(xsrfHeadersFromStorageState(resolveApiStorageStatePath(testInfo.workerIndex)));
  }
});

export { expect } from '@playwright/test';
