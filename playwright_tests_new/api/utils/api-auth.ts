import { chromium, request, type BrowserContext } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { IdamPage } from '../../E2E/page-objects/pages/idam.po';
import { OrganisationPage } from '../../E2E/page-objects/pages/organisation.po';

export type ManageOrgUserRole = 'base' | 'roo';

type ManageOrgTestUser = {
  email: string;
  password: string;
};

type StoredAuthState = {
  cookies?: Array<{
    domain?: string;
    expires?: number;
    name?: string;
    value?: string;
  }>;
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

const isManageOrgUserRole = (role: string | undefined): role is ManageOrgUserRole => role === 'base' || role === 'roo';

export const resolveBaseUrl = (): string => process.env.TEST_URL || 'https://manage-org.aat.platform.hmcts.net/';

const resolveBaseHostname = (): string => new URL(resolveBaseUrl()).hostname;

const normalizeCookieDomain = (domain: string | undefined): string => domain?.replace(/^\./, '').toLowerCase() ?? '';

const sanitizeStorageScope = (value: string): string => value.replace(/[^a-zA-Z0-9.-]+/g, '-').replace(/^-|-$/g, '');

const cookieMatchesHost = (cookieDomain: string | undefined, hostname: string): boolean => {
  const normalizedDomain = normalizeCookieDomain(cookieDomain);
  return Boolean(normalizedDomain && (hostname.toLowerCase() === normalizedDomain || hostname.toLowerCase().endsWith(`.${normalizedDomain}`)));
};

const cookieIsNotExpired = (expires: number | undefined): boolean => {
  if (expires === undefined || expires < 0) {
    return true;
  }
  return expires > Date.now() / 1000;
};

export const resolveConfiguredUserRole = (): ManageOrgUserRole => {
  const configuredRole = process.env.MANAGE_ORG_TEST_USER_ROLE;
  if (!configuredRole) {
    return 'roo';
  }
  if (!isManageOrgUserRole(configuredRole)) {
    throw new Error('MANAGE_ORG_TEST_USER_ROLE must be either base or roo.');
  }
  return configuredRole;
};

export const resolveTestUser = (role: ManageOrgUserRole = resolveConfiguredUserRole()): ManageOrgTestUser => {
  const envNames = userEnvByRole[role];
  const email = process.env[envNames.email];
  const password = process.env[envNames.password];

  if (!email || !password) {
    throw new Error(
      `Missing Playwright API credentials for ${role} user. Populate ${envNames.email} and ${envNames.password} with yarn env:populate:aat or secure local env values.`
    );
  }

  return { email, password };
};

export const resolveApiStorageStatePath = (workerIndex: number, role: ManageOrgUserRole = resolveConfiguredUserRole()): string => {
  const configuredPath = process.env.MANAGE_ORG_STORAGE_STATE?.trim();
  const stateFileName = `api-${role}-${sanitizeStorageScope(resolveBaseHostname())}-worker-${workerIndex}.json`;
  if (configuredPath) {
    return resolve(configuredPath, stateFileName);
  }
  return join(tmpdir(), 'rpx-xui-manage-organisations-playwright', stateFileName);
};

const readStoredAuthState = (storageStatePath: string): StoredAuthState | undefined => {
  if (!existsSync(storageStatePath)) {
    return undefined;
  }
  try {
    return JSON.parse(readFileSync(storageStatePath, 'utf-8')) as StoredAuthState;
  } catch {
    try {
      unlinkSync(storageStatePath);
    } catch {
      // Ignore cleanup races; the next login will write a fresh state file.
    }
    return undefined;
  }
};

const hasSessionCookies = (storageStatePath: string): boolean => {
  const state = readStoredAuthState(storageStatePath);
  const baseHostname = resolveBaseHostname();
  return Boolean(
    state?.cookies?.some(
      (cookie) =>
        (cookie.name === '__auth__' || cookie.name === 'xui-mo-webapp') &&
        cookieMatchesHost(cookie.domain, baseHostname) &&
        cookieIsNotExpired(cookie.expires)
    )
  );
};

export const xsrfHeadersFromStorageState = (storageStatePath: string): Record<string, string> => {
  const state = readStoredAuthState(storageStatePath);
  const baseHostname = resolveBaseHostname();
  const xsrf = state?.cookies?.find(
    (cookie) => cookie.name === 'XSRF-TOKEN' && cookieMatchesHost(cookie.domain, baseHostname) && cookieIsNotExpired(cookie.expires)
  )?.value;
  return xsrf ? { 'X-XSRF-TOKEN': xsrf } : {};
};

const waitForAuthenticatedApiSession = async (context: BrowserContext): Promise<void> => {
  let lastStatus = 0;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const response = await context.request.get('api/organisation/v1', { failOnStatusCode: false });
    lastStatus = response.status();
    if (lastStatus === 200) {
      return;
    }
    await delay(1000);
  }
  throw new Error(`Authenticated API session was not ready after login. Last status: ${lastStatus}`);
};

const storageStateHasAuthenticatedApiSession = async (storageStatePath: string): Promise<boolean> => {
  const context = await request.newContext({
    baseURL: resolveBaseUrl(),
    ignoreHTTPSErrors: true,
    storageState: storageStatePath
  });
  try {
    const response = await context.get('api/organisation/v1', { failOnStatusCode: false });
    return response.status() === 200;
  } finally {
    await context.dispose();
  }
};

export const ensureApiStorageState = async (workerIndex: number, role: ManageOrgUserRole = resolveConfiguredUserRole()): Promise<string> => {
  const storageStatePath = resolveApiStorageStatePath(workerIndex, role);
  mkdirSync(dirname(storageStatePath), { recursive: true });
  if (hasSessionCookies(storageStatePath) && await storageStateHasAuthenticatedApiSession(storageStatePath)) {
    return storageStatePath;
  }

  const user = resolveTestUser(role);
  const browser = await chromium.launch({ headless: process.env.HEAD !== 'true' });
  let context: BrowserContext | undefined;
  try {
    context = await browser.newContext({
      baseURL: resolveBaseUrl(),
      ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
    const idamPage = new IdamPage(page);
    const organisationPage = new OrganisationPage(page);
    await page.goto('');
    await idamPage.signIn(user.email, user.password);
    await organisationPage.navigationLink.waitFor({ state: 'visible', timeout: 30 * 1000 });
    await waitForAuthenticatedApiSession(context);
    await context.storageState({ path: storageStatePath });
    return storageStatePath;
  } finally {
    await context?.close();
    await browser.close();
  }
};
