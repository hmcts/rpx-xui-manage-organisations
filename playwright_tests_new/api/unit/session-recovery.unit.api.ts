import { chromium, expect, request, test } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sinon from 'sinon';
import { publishSessionState } from '../../common/sessionState';
import { ensureApiStorageState, resolveApiStorageStatePath, xsrfHeadersFromStorageState } from '../utils/api-auth';
import { IdamPage } from '../../E2E/page-objects/pages/idam.po';

test.describe('Manage Org session recovery', { tag: '@svc-internal' }, () => {
  test.describe.configure({ mode: 'default' });
  let root: string;
  const originalLaunch = chromium.launch;
  const originalRequest = request.newContext;
  const originalSignIn = IdamPage.prototype.signIn;
  const keys = ['MANAGE_ORG_STORAGE_STATE', 'TEST_URL', 'TEST_ROO_EMAIL', 'TEST_ROO_PASSWORD'] as const;
  let env: Array<string | undefined>;
  test.beforeEach(() => {
    env = keys.map((key) => process.env[key]);
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'mo-recovery-'));
    Object.assign(process.env, {
      MANAGE_ORG_STORAGE_STATE: root,
      TEST_URL: 'http://framework.test/',
      TEST_ROO_EMAIL: 'fictional@example.invalid',
      TEST_ROO_PASSWORD: 'synthetic-secret'
    });
    IdamPage.prototype.signIn = async () => undefined;
    request.newContext = async () => ({ get: async () => ({ status: () => 401 }), dispose: async () => undefined }) as never;
  });
  test.afterEach(() => {
    chromium.launch = originalLaunch;
    request.newContext = originalRequest;
    IdamPage.prototype.signIn = originalSignIn;
    keys.forEach((key, index) => {
      if (env[index] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = env[index];
      }
    });
    fs.rmSync(root, { recursive: true, force: true });
  });

  for (const failure of ['context', 'browser', 'both', 'newContext', 'none']) {
    test(`always attempts browser cleanup after ${failure}`, async () => {
      const events: string[] = [];
      const locator = {
        first() {
          return this;
        },
        waitFor: async () => undefined
      };
      const page = { goto: async () => undefined, getByRole: () => locator, getByLabel: () => locator, locator: () => locator };
      const context = {
        newPage: async () => page,
        request: { get: async () => ({ status: () => 200 }) },
        storageState: async (options?: { path: string }) => {
          const state = { cookies: [] };
          if (options) {
            fs.writeFileSync(options.path, JSON.stringify(state));
          }
          return state;
        },
        close: async () => {
          events.push('context-close');
          if (failure === 'context' || failure === 'both') {
            throw new Error('context synthetic-secret');
          }
        }
      };
      chromium.launch = async () =>
        ({
          newContext: async () => {
            if (failure === 'newContext') {
              throw new Error('newContext synthetic-secret');
            }
            return context;
          },
          close: async () => {
            events.push('browser-close');
            if (failure === 'browser' || failure === 'both') {
              throw new Error('browser synthetic-secret');
            }
          }
        }) as never;
      const capture = ensureApiStorageState(0, 'roo');
      if (failure === 'none') {
        await capture;
      } else {
        await expect(capture).rejects.toThrow();
      }
      if (failure !== 'none') {
        await expect(capture).rejects.not.toThrow('synthetic-secret');
      }
      expect(events).toContain('browser-close');
      if (failure === 'both') {
        await expect(capture).rejects.toThrow(/context.*browser|browser.*context/i);
      }
    });
  }

  for (const failure of ['timeout', 'auth-status', 'unknown']) {
    test(`serialized ${failure} and cleanup failure retain safe categories`, async () => {
      const locator = { first() {
        return this;
      }, waitFor: async () => undefined };
      const page = { goto: async () => undefined, getByRole: () => locator, getByLabel: () => locator, locator: () => locator };
      const context = {
        newPage: async () => {
          if (failure === 'timeout') {
            const error = new Error('synthetic-secret fictional@example.invalid'); error.name = 'TimeoutError'; throw error;
          }
          if (failure === 'unknown') {
            throw new Error('synthetic-secret fictional@example.invalid');
          }
          return page;
        },
        request: { get: async () => ({ status: () => 503 }) },
        close: async () => {
          throw new Error('context synthetic-secret');
        }
      };
      chromium.launch = async () => ({ newContext: async () => context, close: async () => {
        throw new Error('browser synthetic-secret');
      } }) as never;
      const error = await ensureApiStorageState(0, 'roo').then(() => new Error('unexpected success'), (error: Error) => error);
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { serializeError } = require('playwright/lib/util');
      const serialized = serializeError(error);
      const expected = failure === 'timeout' ? 'Manage Org session capture timed out.'
        : failure === 'auth-status' ? 'Authenticated API session was not ready after login. Last status: 503'
          : 'Manage Org session capture failed.';
      expect(serialized.message).toContain(expected);
      expect(serialized.message).toContain('context and browser cleanup was not confirmed.');
      expect(JSON.stringify(serialized)).not.toContain('synthetic-secret');
      expect(JSON.stringify(serialized)).not.toContain('fictional@example.invalid');
      expect(fs.existsSync(resolveApiStorageStatePath(0, 'roo'))).toBe(false);
    });
  }

  for (const failure of ['partial-write', 'rename']) {
    test(`publisher preserves final bytes and another writer's temp after ${failure}`, async () => {
      const storagePath = path.join(root, 'state.json');
      const sentinel = `${storagePath}.other-writer.tmp`;
      const before = JSON.stringify({ cookies: [{ name: '__auth__', value: 'previous' }] });
      fs.writeFileSync(storagePath, before);
      fs.writeFileSync(sentinel, 'other writer');
      const originalWrite = fs.writeFileSync;
      const write = sinon.stub(fs, 'writeFileSync');
      const rename = sinon.stub(fs, 'renameSync');
      write.callsFake((...args: Parameters<typeof fs.writeFileSync>) => {
        if (failure === 'partial-write' && String(args[0]).startsWith(`${storagePath}.`) && String(args[0]).endsWith('.tmp')) {
          originalWrite(args[0], '{partial');
          throw new Error('synthetic temporary write failed');
        }
        return originalWrite(...args);
      });
      if (failure === 'rename') {
        rename.throws(new Error('synthetic rename failed'));
      } else {
        rename.callThrough();
      }
      try {
        const context = { storageState: async () => ({ cookies: [], origins: [] }) };
        await expect(publishSessionState(context as never, storagePath)).rejects.toThrow(failure === 'rename' ? 'synthetic rename failed' : 'synthetic temporary write failed');
      } finally {
        write.restore(); rename.restore();
      }
      expect(fs.readFileSync(storagePath, 'utf8')).toBe(before);
      expect(fs.readFileSync(sentinel, 'utf8')).toBe('other writer');
      expect(fs.readdirSync(root).sort()).toEqual(['state.json', 'state.json.other-writer.tmp']);
    });
  }

  test('interrupted publication preserves prior valid bytes', async () => {
    const statePath = resolveApiStorageStatePath(0, 'roo');
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    const before = JSON.stringify({ cookies: [{ name: '__auth__', value: 'old', domain: 'framework.test', expires: -1 }] });
    fs.writeFileSync(statePath, before);
    const locator = {
      first() {
        return this;
      },
      waitFor: async () => undefined
    };
    const page = { goto: async () => undefined, getByRole: () => locator, getByLabel: () => locator, locator: () => locator };
    chromium.launch = async () =>
      ({
        newContext: async () => ({
          newPage: async () => page,
          request: { get: async () => ({ status: () => 200 }) },
          close: async () => undefined,
          storageState: async (options?: { path: string }) => {
            if (options) {
              fs.writeFileSync(options.path, '{partial');
            }
            throw new Error('interrupted');
          }
        }),
        close: async () => undefined
      }) as never;
    await expect(ensureApiStorageState(0, 'roo')).rejects.toThrow();
    expect(fs.readFileSync(statePath, 'utf8')).toBe(before);
  });

  test('concurrent same-path requests capture once', async () => {
    let launches = 0;
    const locator = {
      first() {
        return this;
      },
      waitFor: async () => undefined
    };
    const page = { goto: async () => undefined, getByRole: () => locator, getByLabel: () => locator, locator: () => locator };
    chromium.launch = async () => {
      launches++;
      return {
        newContext: async () => ({
          newPage: async () => page,
          request: { get: async () => ({ status: () => 200 }) },
          close: async () => undefined,
          storageState: async (options?: { path: string }) => {
            const state = { cookies: [] };
            if (options) {
              fs.writeFileSync(options.path, JSON.stringify(state));
            }
            return state;
          }
        }),
        close: async () => undefined
      } as never;
    };
    const [first, second] = await Promise.all([ensureApiStorageState(0, 'roo'), ensureApiStorageState(0, 'roo')]);
    expect(first).toBe(second);
    expect(launches).toBe(1);
  });

  test('unconfirmed browser cleanup blocks another capture in the same worker', async () => {
    let launches = 0;
    chromium.launch = async () => {
      launches++;
      return {
        newContext: async () => {
          throw new Error('synthetic-secret');
        },
        close: async () => {
          throw new Error('synthetic-secret');
        }
      } as never;
    };
    await expect(ensureApiStorageState(0, 'roo')).rejects.toThrow(/browser cleanup/i);
    await expect(ensureApiStorageState(0, 'roo')).rejects.toThrow(/restart the worker/i);
    expect(launches).toBe(1);
  });

  test('corrupt cache reads do not delete shared metadata', () => {
    const storagePath = resolveApiStorageStatePath(0, 'roo');
    fs.mkdirSync(path.dirname(storagePath), { recursive: true });
    fs.writeFileSync(storagePath, '{corrupt');
    expect(xsrfHeadersFromStorageState(storagePath)).toEqual({});
    expect(fs.readFileSync(storagePath, 'utf8')).toBe('{corrupt');
  });

  test('identity and host changes cannot share a cached session path', () => {
    const first = resolveApiStorageStatePath(0, 'roo');
    process.env.TEST_ROO_EMAIL = 'other@example.invalid';
    expect(resolveApiStorageStatePath(0, 'roo')).not.toBe(first);
    process.env.TEST_ROO_EMAIL = 'fictional@example.invalid';
    process.env.TEST_URL = 'http://other.test/';
    expect(resolveApiStorageStatePath(0, 'roo')).not.toBe(first);
    expect(first).not.toContain('fictional');
    expect(first).not.toContain('synthetic-secret');
  });
});
