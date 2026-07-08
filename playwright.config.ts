import { defineConfig, devices } from '@playwright/test';
import {
  resolveOutputDir,
  resolveReporters,
  resolveTagGrep,
  resolveTagGrepInvert,
  resolveWorkerCount,
} from './playwright-reporting';
const { version: appVersion } = require('./package.json');

type EnvMap = NodeJS.ProcessEnv;

const WAVE_LIKE_A11Y_TAG = '@wave-a11y';
const waveLikeA11ySpecPattern = '**/*.wave-a11y.spec.ts';

const splitTags = (raw: string | undefined): string[] =>
  (raw ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

export const includesWaveLikeA11y = (env: EnvMap): boolean =>
  env.PLAYWRIGHT_INCLUDE_WAVE_A11Y === 'true' || splitTags(env.PLAYWRIGHT_TAGS).includes(WAVE_LIKE_A11Y_TAG);

require('dotenv-extended').load({
  defaults: '.env.example',
  errorOnExtra: false,
  errorOnMissing: false,
  includeProcessEnv: true,
  silent: true,
});

const headlessMode = process.env.HEAD !== 'true';
export const axeTestEnabled = process.env.ENABLE_AXE_TESTS === 'true';
const smokeSpecPattern = 'playwright_tests_new/E2E/test/smoke/smokeTest.spec.ts';
const waveLikeA11yIgnore = includesWaveLikeA11y(process.env) ? [] : [waveLikeA11ySpecPattern];
const baseUrl = process.env.TEST_URL || 'http://localhost:3000/';
const workerCount = resolveWorkerCount(process.env);
const outputDir = resolveOutputDir(process.env);

module.exports = defineConfig({
  outputDir,
  use: {
    baseURL: baseUrl,
  },
  testDir: '.',
  testMatch: ['playwright_tests_new/E2E/**/*.spec.ts', 'playwright_tests_new/api/**/*.api.ts'],
  grep: resolveTagGrep(process.env),
  grepInvert: resolveTagGrepInvert(process.env),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 3, // Set the number of retries for all projects

  timeout: 3 * 60 * 1000,
  expect: {
    timeout: 1 * 60 * 1000,
  },
  reportSlowTests: null,

  /* Opt out of parallel tests on CI. */
  workers: workerCount,

  reporter: resolveReporters(
    {
      defaultIndexFilename: 'xui-playwright-e2e.html',
      defaultProject: 'RPX XUI Manage Organisations',
      defaultRelease: appVersion,
      defaultTitle: 'RPX XUI Manage Organisations Playwright',
      includeJunit: true,
    },
    baseUrl,
    process.env
  ),

  projects: [
    {
      name: 'chromium',
      testIgnore: [smokeSpecPattern, 'playwright_tests_new/api/**', ...waveLikeA11yIgnore],
      use: { ...devices['Desktop Chrome'], channel: 'chrome', headless: headlessMode, trace: 'on-first-retry' },
    },
    {
      name: 'firefox',
      testIgnore: [smokeSpecPattern, 'playwright_tests_new/api/**', ...waveLikeA11yIgnore],
      use: { ...devices['Desktop Firefox'], screenshot: 'only-on-failure', headless: headlessMode, trace: 'off' },
    },
    {
      name: 'webkit',
      testIgnore: [smokeSpecPattern, 'playwright_tests_new/api/**', ...waveLikeA11yIgnore],
      use: {
        screenshot: 'only-on-failure',
        headless: headlessMode,
        trace: 'off',
      },
    },
    {
      name: 'smoke',
      testMatch: [smokeSpecPattern],
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: headlessMode,
        screenshot: 'only-on-failure',
        trace: 'on-first-retry',
      },
    },
    {
      name: 'node-api',
      testMatch: ['playwright_tests_new/api/**/*.api.ts'],
      fullyParallel: true,
      workers: workerCount,
      retries: process.env.CI ? 2 : 0,
      timeout: 60 * 1000,
      expect: {
        timeout: 10 * 1000,
      },
      use: {
        baseURL: baseUrl,
        ignoreHTTPSErrors: true,
        headless: true,
        screenshot: 'off',
        trace: 'off',
        video: 'off',
      },
    },
  ],
});
