import { defineConfig, devices } from '@playwright/test';
import { load as loadDotenv } from 'dotenv-extended';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolveOutputDir, resolveReporters, resolveWorkerCount } from './playwright-reporting';
import { logResolvedTagFilters, resolveE2eTagFilters } from './playwright-tag-filter';

type EnvMap = NodeJS.ProcessEnv;

const WAVE_LIKE_A11Y_TAG = '@wave-a11y';
const waveLikeA11ySpecPattern = '**/*.wave-a11y.spec.ts';

const splitTags = (raw: string | undefined): string[] =>
  (raw ?? '')
    .split(/[\s,]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);

export const includesWaveLikeA11y = (env: EnvMap): boolean =>
  env.PLAYWRIGHT_INCLUDE_WAVE_A11Y === 'true' || splitTags(env.PLAYWRIGHT_TAGS).includes(WAVE_LIKE_A11Y_TAG);

loadDotenv({
  defaults: '.env.example',
  errorOnExtra: false,
  errorOnMissing: false,
  includeProcessEnv: true,
  silent: true,
});

const headlessMode = process.env.HEAD !== 'true';
const baseUrl = process.env.TEST_URL || 'https://manage-org.aat.platform.hmcts.net/';
const workerCount = resolveWorkerCount(process.env);
const outputDir = resolveOutputDir(process.env);
const e2eTagFilters = resolveE2eTagFilters(process.env);
logResolvedTagFilters('Cross-browser E2E', e2eTagFilters);
const { version: appVersion } = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8')) as { version: string };

module.exports = defineConfig({
  outputDir,
  testDir: 'playwright_tests_new/E2E',
  testMatch: ['**/test/**/*.spec.ts'],
  testIgnore: [
    '**/test/smoke/smokeTest.spec.ts',
    '**/*.a11y.spec.ts',
    ...(includesWaveLikeA11y(process.env) ? [] : [waveLikeA11ySpecPattern]),
  ],
  grep: e2eTagFilters.grep,
  grepInvert: e2eTagFilters.grepInvert,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 3 * 60 * 1000,
  expect: {
    timeout: 1 * 60 * 1000,
  },
  reportSlowTests: null,
  workers: workerCount,
  reporter: resolveReporters(
    {
      defaultIndexFilename: 'xui-playwright-e2e.html',
      defaultProject: 'RPX XUI Manage Organisations',
      defaultRelease: appVersion,
      defaultTitle: 'RPX XUI Manage Organisations Playwright Cross Browser',
      includeJunit: true,
    },
    baseUrl,
    process.env
  ),
  use: {
    baseURL: baseUrl,
    ignoreHTTPSErrors: true,
    headless: headlessMode,
    trace: 'on-first-retry',
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },
    video: 'off',
  },
  projects: [
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
});
