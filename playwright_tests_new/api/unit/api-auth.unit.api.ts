import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  __test__ as apiAuthTest,
  resolveApiStorageStatePath,
  resolveConfiguredUserRole,
  resolveTestUser,
  xsrfHeadersFromStorageState
} from '../utils/api-auth';

const envKeys = [
  'MANAGE_ORG_STORAGE_STATE',
  'MANAGE_ORG_TEST_USER_ROLE',
  'TEST_ROO_EMAIL',
  'TEST_ROO_PASSWORD',
  'TEST_URL'
] as const;

type TestEnvKey = typeof envKeys[number];

const withEnv = async (updates: Partial<Record<TestEnvKey, string | undefined>>, body: () => Promise<void> | void): Promise<void> => {
  const previous = Object.fromEntries(envKeys.map((key) => [key, process.env[key]])) as Record<TestEnvKey, string | undefined>;

  try {
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    await body();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
};

const writeStorageState = (storagePath: string, cookies: unknown[]): void => {
  fs.writeFileSync(storagePath, JSON.stringify({ cookies }));
};

test.describe('Manage Org API auth support', { tag: '@svc-internal' }, () => {
  test('resolves the configured API user role and rejects unsupported aliases', async () => {
    await withEnv({ MANAGE_ORG_TEST_USER_ROLE: undefined }, () => {
      expect(resolveConfiguredUserRole()).toBe('roo');
    });

    await withEnv({ MANAGE_ORG_TEST_USER_ROLE: 'base' }, () => {
      expect(resolveConfiguredUserRole()).toBe('base');
    });

    await withEnv({ MANAGE_ORG_TEST_USER_ROLE: 'solicitor' }, () => {
      expect(() => resolveConfiguredUserRole()).toThrow(/must be either base or roo/i);
    });
  });

  test('resolves role-specific credentials from the documented environment contract', async () => {
    await withEnv(
      {
        MANAGE_ORG_TEST_USER_ROLE: 'roo',
        TEST_ROO_EMAIL: 'roo@example.test',
        TEST_ROO_PASSWORD: 'secure-password'
      },
      () => {
        expect(resolveTestUser()).toEqual({
          email: 'roo@example.test',
          password: 'secure-password'
        });
      }
    );
  });

  test('scopes API storage state by role, host and worker', async () => {
    const storageRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-api-state-'));

    try {
      await withEnv(
        {
          MANAGE_ORG_STORAGE_STATE: storageRoot,
          MANAGE_ORG_TEST_USER_ROLE: 'roo',
          TEST_URL: 'https://manage-org-preview-pr-1532.service.core-compute-preview.internal/'
        },
        () => {
          expect(resolveApiStorageStatePath(4)).toBe(
            path.join(storageRoot, 'api-roo-manage-org-preview-pr-1532.service.core-compute-preview.internal-worker-4.json')
          );
        }
      );
    } finally {
      fs.rmSync(storageRoot, { recursive: true, force: true });
    }
  });

  test('accepts only live auth cookies for the current Manage Org host', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-auth-cookies-'));
    const storagePath = path.join(tempDir, 'state.json');
    const futureExpiry = Math.floor(Date.now() / 1000) + 600;

    try {
      await withEnv({ TEST_URL: 'https://manage-org.aat.platform.hmcts.net/' }, () => {
        writeStorageState(storagePath, [
          { name: '__auth__', domain: '.aat.platform.hmcts.net', value: 'valid-auth', expires: futureExpiry }
        ]);
        expect(apiAuthTest.hasSessionCookies(storagePath)).toBe(true);

        writeStorageState(storagePath, [
          { name: '__auth__', domain: 'idam-web-public.aat.platform.hmcts.net', value: 'wrong-host', expires: futureExpiry }
        ]);
        expect(apiAuthTest.hasSessionCookies(storagePath)).toBe(false);

        writeStorageState(storagePath, [
          { name: 'xui-mo-webapp', domain: '.aat.platform.hmcts.net', value: 'expired-auth', expires: Math.floor(Date.now() / 1000) - 60 }
        ]);
        expect(apiAuthTest.hasSessionCookies(storagePath)).toBe(false);
      });
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('extracts XSRF headers only from a live cookie for the current Manage Org host', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-xsrf-'));
    const storagePath = path.join(tempDir, 'state.json');
    const futureExpiry = Math.floor(Date.now() / 1000) + 600;

    try {
      await withEnv({ TEST_URL: 'https://manage-org.aat.platform.hmcts.net/' }, () => {
        writeStorageState(storagePath, [
          { name: 'XSRF-TOKEN', domain: 'idam-web-public.aat.platform.hmcts.net', value: 'wrong-host', expires: futureExpiry },
          { name: 'XSRF-TOKEN', domain: '.aat.platform.hmcts.net', value: 'valid-xsrf', expires: futureExpiry }
        ]);

        expect(xsrfHeadersFromStorageState(storagePath)).toEqual({
          'X-XSRF-TOKEN': 'valid-xsrf'
        });
      });
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
