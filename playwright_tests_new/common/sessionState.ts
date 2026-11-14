import type { BrowserContext } from '@playwright/test';
import { createHash, randomUUID } from 'node:crypto';
import { mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

// A restarted worker gets a new cache; tests in one worker keep reusing it.
const workerScope = randomUUID();
const captures = new Map<string, Promise<string>>();
const ownedDirectories = new Set<string>();
process.once('exit', () => {
  for (const directory of ownedDirectories) {
    rmSync(directory, { recursive: true, force: true });
  }
});

export const resolveSessionStatePath = (name: string, identity: string): string => {
  const root = process.env.MANAGE_ORG_STORAGE_STATE?.trim() || join(tmpdir(), 'rpx-xui-manage-organisations-playwright');
  const identityKey = createHash('sha256').update(identity.trim().toLowerCase()).digest('hex').slice(0, 20);
  const directory = resolve(root, workerScope);
  ownedDirectories.add(directory);
  return resolve(directory, `${name}-${identityKey}.json`);
};

export const publishSessionState = async (context: Pick<BrowserContext, 'storageState'>, storagePath: string): Promise<void> => {
  const state = await context.storageState();
  mkdirSync(dirname(storagePath), { recursive: true, mode: 0o700 });
  const temporaryPath = `${storagePath}.${randomUUID()}.tmp`;
  try {
    writeFileSync(temporaryPath, JSON.stringify(state), { flag: 'wx', mode: 0o600 });
    renameSync(temporaryPath, storagePath);
  } finally {
    rmSync(temporaryPath, { force: true });
  }
};

export const captureSessionOnce = (storagePath: string, capture: () => Promise<string>): Promise<string> => {
  const existing = captures.get(storagePath);
  if (existing) {
    return existing;
  }
  const pending = Promise.resolve()
    .then(capture)
    .finally(() => captures.delete(storagePath));
  captures.set(storagePath, pending);
  return pending;
};
