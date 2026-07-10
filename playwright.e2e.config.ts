import { defineConfig, devices } from '@playwright/test';
import { load as loadDotenv } from 'dotenv-extended';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  resolveOutputDir,
  resolveReporters,
  resolveTagGrep,
  resolveTagGrepInvert,
  resolveWorkerCount,
} from './playwright-reporting';

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
const disableGenericFailureArtifacts = process.env.PLAYWRIGHT_DISABLE_GENERIC_FAILURE_ARTIFACTS === 'true';
const { version: appVersion } = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8')) as { version: string };

const config = defineConfig({
  outputDir,
  testDir: 'playwright_tests_new/E2E',
  testMatch: ['**/test/**/*.spec.ts'],
  testIgnore: [
    '**/test/smoke/smokeTest.spec.ts',
    ...(process.env.PLAYWRIGHT_INCLUDE_A11Y === 'true' ? [] : ['**/*.a11y.spec.ts']),
    ...(includesWaveLikeA11y(process.env) ? [] : [waveLikeA11ySpecPattern]),
  ],
  grep: resolveTagGrep(process.env),
  grepInvert: resolveTagGrepInvert(process.env),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: 3 * 60 * 1000,
  expect: {
    timeout: 1 * 60 * 1000,
  },
  reportSlowTests: null,
  workers: workerCount,
  reporter: resolveReporters(
    {
      defaultIndexFilename: 'xui-playwright-e2e.html',
      defaultProject: 'RPX XUI Manage Organisations - E2E',
      defaultRelease: appVersion,
      defaultTitle: 'RPX XUI Manage Organisations Playwright E2E',
      includeJunit: true,
    },
    baseUrl,
    process.env
  ),
  use: {
    baseURL: baseUrl,
    ignoreHTTPSErrors: true,
    headless: headlessMode,
    trace: disableGenericFailureArtifacts ? 'off' : 'retain-on-failure',
    screenshot: disableGenericFailureArtifacts
      ? 'off'
      : {
          mode: 'only-on-failure',
          fullPage: true,
        },
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
});

(config as { __test__?: unknown }).__test__ = {
  includesWaveLikeA11y,
};

module.exports = config;
