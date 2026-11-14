import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { test as signedInTest } from '../../fixtures';
import { ensureApiStorageState, resolveApiStorageStatePath } from '../../../api/utils/api-auth';

const mode = process.env.MO_RECOVERY_PROBE_MODE;
const receipt = process.env.MO_RECOVERY_PROBE_RECEIPT!;
const before = process.env.MO_RECOVERY_PROBE_BEFORE!;
if (!mode || !receipt || !before) {
  throw new Error('Run this child fixture through session-recovery.spec.ts.');
}

if (mode === 'ui') {
  for (const step of [1, 2]) {
    signedInTest(`UI fixture cache ${step}`, async ({ signedInPage, manageOrgStorageStatePath }) => {
      await expect(signedInPage.getByRole('link', { name: 'Organisation', exact: true })).toBeVisible();
      const saved = JSON.parse(fs.readFileSync(manageOrgStorageStatePath, 'utf8'));
      expect(saved.cookies.some((cookie: { name: string }) => cookie.name === '__auth__')).toBe(true);
      fs.writeFileSync(receipt, JSON.stringify({ path: manageOrgStorageStatePath, step }));
    });
  }
} else {
  if (mode === 'restart') {
    test('intentional worker timeout', async ({ browserName }, info) => {
      void browserName;
      test.setTimeout(6_000);
      fs.writeFileSync(before, JSON.stringify({ path: resolveApiStorageStatePath(info.workerIndex, 'roo'), worker: info.workerIndex, pid: process.pid }));
      await ensureApiStorageState(info.workerIndex, 'roo');
    });
  }
  test('captures and reuses only its own state', async ({ browserName }, info) => {
    void browserName;
    const state = await ensureApiStorageState(info.workerIndex, 'roo');
    expect(await ensureApiStorageState(info.workerIndex, 'roo')).toBe(state);
    const saved = JSON.parse(fs.readFileSync(state, 'utf8'));
    expect(saved.cookies.some((cookie: { name: string }) => cookie.name === '__auth__')).toBe(true);
    fs.writeFileSync(receipt, JSON.stringify({ path: state, worker: info.workerIndex, pid: process.pid }));
  });
}
