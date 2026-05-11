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
type LoggerLevel = 'debug' | 'error' | 'info' | 'warn';

const baseUrl = stripTrailingSlash(resolveBaseUrl());
const redactedValue = '[REDACTED]';
const sensitiveKeyPattern = /authorization|cookie|email|organisationidentifier|orgid|password|roles|secret|session|sessiontimeout|token|userid|useridentifier/i;
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const uuidPattern = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi;
const queryValuePattern = /([?&](?:email|organisationIdentifier|orgId|password|session|sessionTimeout|token|userId|userIdentifier)=)[^&#\s]+/gi;
const jsonSensitiveValuePattern = /("(?:email|organisationIdentifier|orgId|password|session|sessionTimeout|token|userId|userIdentifier)"\s*:\s*)"[^"]*"/gi;
const authHeaderPattern = /\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]+/gi;

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
    logger: createSanitizedApiClientLogger(logger),
    captureRawBodies: false,
    onResponse: (entry) => apiLogs.push(sanitizeApiLogEntry(entry)),
    requestFactory: async () => context
  });
};

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function createSanitizedApiClientLogger(logger: LoggerInstance): LoggerInstance {
  const sanitizedLogger = Object.create(logger) as LoggerInstance;

  (['debug', 'error', 'info', 'warn'] as LoggerLevel[]).forEach((level) => {
    sanitizedLogger[level] = ((message: unknown, ...meta: unknown[]) => {
      return logger[level](sanitizeApiLogString(message), ...meta.map((entry) => sanitizeApiLogValue(entry)));
    }) as LoggerInstance[typeof level];
  });

  sanitizedLogger.log = ((...args: unknown[]) => {
    return logger.log(...(args.map((entry) => sanitizeApiLogValue(entry)) as Parameters<LoggerInstance['log']>));
  }) as LoggerInstance['log'];

  sanitizedLogger.child = ((defaultMeta?: object) => {
    return createSanitizedApiClientLogger(logger.child(sanitizeApiLogValue(defaultMeta) as object));
  }) as LoggerInstance['child'];

  return sanitizedLogger;
}

function sanitizeApiLogEntry(entry: ApiLogEntry): ApiLogEntry {
  return sanitizeApiLogValue(entry) as ApiLogEntry;
}

function sanitizeApiLogValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return sanitizeApiLogString(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeApiLogValue(entry));
  }

  if (!isPlainRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => {
      if (sensitiveKeyPattern.test(key)) {
        return [key, redactedValue];
      }

      return [key, sanitizeApiLogValue(entry)];
    })
  );
}

function sanitizeApiLogString(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  return value
    .replace(jsonSensitiveValuePattern, `$1"${redactedValue}"`)
    .replace(emailPattern, redactedValue)
    .replace(authHeaderPattern, `$1 ${redactedValue}`)
    .replace(queryValuePattern, `$1${redactedValue}`)
    .replace(uuidPattern, redactedValue);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export const __test__ = {
  createSanitizedApiClientLogger,
  sanitizeApiLogEntry,
  sanitizeApiLogValue
};
