import { promises as fs } from 'node:fs';

import { ApiClient as PlaywrightApiClient, type ApiLogEntry, createLogger } from '@hmcts/playwright-common';
import { request, test as base } from '@playwright/test';
import {
  ensureApiStorageState,
  type ManageOrgUserRole,
  resolveApiStorageStatePath,
  resolveBaseUrl,
  xsrfHeadersFromStorageState
} from './utils/api-auth';

export { expect } from '@playwright/test';
export { buildApiAttachment } from '@hmcts/playwright-common';

type ApiFixtures = {
  anonymousClient: PlaywrightApiClient;
  apiClient: PlaywrightApiClient;
  apiClientFor: (role: ManageOrgUserRole) => Promise<PlaywrightApiClient>;
  apiLogs: ApiLogEntry[];
  logger: LoggerInstance;
  xsrfHeaders: Record<string, string>;
};

type LoggerInstance = ReturnType<typeof createLogger>;

const baseUrl = stripTrailingSlash(resolveBaseUrl());

export const test = base.extend<ApiFixtures>({
  logger: async ({ browserName: _browserName }, use, workerInfo) => {
    void _browserName;
    const logger = createLogger({
      serviceName: 'rpx-xui-manage-organisations-node-api',
      defaultMeta: { workerId: workerInfo.workerIndex },
      format: 'pretty'
    });
    await use(logger);
  },
  apiLogs: async ({ browserName: _browserName }, use, testInfo) => {
    void _browserName;
    const entries: ApiLogEntry[] = [];
    await use(entries);

    if (entries.length && (testInfo.status === 'failed' || testInfo.status === 'timedOut')) {
      const pretty = entries.map((entry) => JSON.stringify(entry, null, 2)).join('\n\n---\n\n');
      await fs.writeFile(testInfo.outputPath('node-api-calls.json'), JSON.stringify(entries, null, 2), 'utf8');
      await fs.writeFile(testInfo.outputPath('node-api-calls.pretty.txt'), pretty, 'utf8');
      await testInfo.attach('node-api-calls.json', {
        body: JSON.stringify(entries, null, 2),
        contentType: 'application/json'
      });
      await testInfo.attach('node-api-calls.pretty.txt', {
        body: pretty,
        contentType: 'text/plain'
      });
    }
  },
  anonymousClient: async ({ apiLogs, logger }, use) => {
    const client = await createNodeApiClient('anonymous', undefined, logger, apiLogs);
    try {
      await use(client);
    } finally {
      await client.dispose();
    }
  },
  apiClient: async ({ apiLogs, logger }, use, testInfo) => {
    const storageState = await ensureApiStorageState(testInfo.workerIndex);
    const client = await createNodeApiClient('authenticated', storageState, logger, apiLogs);
    try {
      await use(client);
    } finally {
      await client.dispose();
    }
  },
  apiClientFor: async ({ apiLogs, logger }, use, testInfo) => {
    const clients: PlaywrightApiClient[] = [];
    const factory = async (role: ManageOrgUserRole): Promise<PlaywrightApiClient> => {
      const storageState = await ensureApiStorageState(testInfo.workerIndex, role);
      const client = await createNodeApiClient(role, storageState, logger, apiLogs);
      clients.push(client);
      return client;
    };

    try {
      await use(factory);
    } finally {
      await Promise.all(clients.map((client) => client.dispose()));
    }
  },
  xsrfHeaders: async ({ browserName: _browserName }, use, testInfo) => {
    void _browserName;
    await ensureApiStorageState(testInfo.workerIndex);
    await use(xsrfHeadersFromStorageState(resolveApiStorageStatePath(testInfo.workerIndex)));
  }
});

const createNodeApiClient = async (
  role: 'anonymous' | 'authenticated' | ManageOrgUserRole,
  storageState: string | undefined,
  logger: LoggerInstance,
  apiLogs: ApiLogEntry[]
): Promise<PlaywrightApiClient> => {
  const context = await request.newContext({
    baseURL: baseUrl,
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    },
    ignoreHTTPSErrors: true,
    storageState
  });

  return new PlaywrightApiClient({
    baseUrl,
    name: `manage-org-node-api-${role}`,
    logger,
    captureRawBodies: process.env.PLAYWRIGHT_DEBUG_API === '1',
    onResponse: (entry) => apiLogs.push(entry),
    requestFactory: async () => context
  });
};

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}
