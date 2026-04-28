import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { PageFixtures, pageFixtures } from './page-objects/pages/page.fixtures';

type ManageOrgUserRole = 'base' | 'roo';

type ManageOrgTestUser = {
  email: string;
  password: string;
  role: ManageOrgUserRole;
};

type SignedInUser = {
  email: string;
  role: ManageOrgUserRole;
};

type AuthFixtures = {
  signedInPage: Page;
  signedInUser: SignedInUser;
};

type AuthWorkerFixtures = {
  manageOrgStorageStatePath: string;
};

const userEnvByRole: Record<ManageOrgUserRole, { email: string; password: string }> = {
  base: {
    email: 'TEST_USER1_EMAIL',
    password: 'TEST_USER1_PASSWORD'
  },
  roo: {
    email: 'TEST_ROO_EMAIL',
    password: 'TEST_ROO_PASSWORD'
  }
};

const isManageOrgUserRole = (role: string | undefined): role is ManageOrgUserRole =>
  role === 'base' || role === 'roo';

const resolveConfiguredUserRole = (): ManageOrgUserRole => {
  const configuredRole = process.env.MANAGE_ORG_TEST_USER_ROLE;
  if (!configuredRole) {
    return 'base';
  }
  if (!isManageOrgUserRole(configuredRole)) {
    throw new Error('MANAGE_ORG_TEST_USER_ROLE must be either base or roo.');
  }
  return configuredRole;
};

const resolveTestUser = (role: ManageOrgUserRole = 'base'): ManageOrgTestUser => {
  const envNames = userEnvByRole[role];
  const email = process.env[envNames.email];
  const password = process.env[envNames.password];

  if (!email || !password) {
    throw new Error(
      `Missing Playwright credentials for ${role} user. Populate ${envNames.email} and ${envNames.password} with yarn env:populate:aat or local secure env values.`
    );
  }

  return { email, password, role };
};

const resolveStorageStatePath = (role: ManageOrgUserRole, browserName: string, workerIndex: number): string => {
  const configuredPath = process.env.MANAGE_ORG_STORAGE_STATE?.trim();
  const stateFileName = `${browserName}-${role}-worker-${workerIndex}.json`;
  if (configuredPath) {
    return resolve(configuredPath, stateFileName);
  }
  return join(tmpdir(), 'rpx-xui-manage-organisations-playwright', stateFileName);
};

export const test = base.extend<PageFixtures & AuthFixtures, AuthWorkerFixtures>({
  ...pageFixtures,
  manageOrgStorageStatePath: [async ({ browserName }, use, workerInfo) => {
    const storageStatePath = resolveStorageStatePath(
      resolveConfiguredUserRole(),
      browserName,
      workerInfo.workerIndex
    );
    mkdirSync(dirname(storageStatePath), { recursive: true });
    await use(storageStatePath);
  }, { scope: 'worker' }],
  storageState: async ({ manageOrgStorageStatePath }, use) => {
    await use(existsSync(manageOrgStorageStatePath) ? manageOrgStorageStatePath : undefined);
  },
  // Playwright fixture callbacks require object destructuring even when no upstream fixture is needed.
  // eslint-disable-next-line no-empty-pattern
  signedInUser: async ({}, use) => {
    const { email, role } = resolveTestUser(resolveConfiguredUserRole());
    await use({ email, role });
  },
  signedInPage: async ({ page, idamPage, manageOrgStorageStatePath }, use) => {
    const testUser = resolveTestUser(resolveConfiguredUserRole());
    await page.goto('');
    if (page.url().includes('/login')) {
      await idamPage.signIn(testUser.email, testUser.password);
      await expect(page.getByRole('link', { name: 'Organisation', exact: true })).toBeVisible();
      await page.context().storageState({ path: manageOrgStorageStatePath });
    }
    await expect(page.getByRole('link', { name: 'Organisation', exact: true })).toBeVisible();
    await use(page);
  }
});
export { expect };
