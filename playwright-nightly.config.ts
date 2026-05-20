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
const { version: appVersion } = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8')) as { version: string };

module.exports = defineConfig({
  outputDir,
  testDir: 'playwright_tests_new/E2E',
  testMatch: ['**/test/**/*.spec.ts'],
  testIgnore: ['**/test/smoke/smokeTest.spec.ts', '**/*.a11y.spec.ts'],
  grep: resolveTagGrep(process.env),
  grepInvert: resolveTagGrepInvert(process.env),
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
