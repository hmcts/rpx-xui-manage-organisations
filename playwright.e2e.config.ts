import { defineConfig, devices } from '@playwright/test';
import { load as loadDotenv } from 'dotenv-extended';
import { version as appVersion } from './package.json';
import { resolveReporters, resolveWorkerCount } from './playwright-reporting';

loadDotenv({
  defaults: '.env.example',
  errorOnExtra: false,
  errorOnMissing: false,
  includeProcessEnv: true,
  silent: true
});

const headlessMode = process.env.HEAD !== 'true';
const baseUrl = process.env.TEST_URL || 'https://manage-org.aat.platform.hmcts.net/';
const workerCount = resolveWorkerCount(process.env);

module.exports = defineConfig({
  testDir: 'playwright_tests_new/E2E',
  testMatch: ['**/test/**/*.spec.ts'],
  testIgnore: ['**/test/smoke/smokeTest.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: 3 * 60 * 1000,
  expect: {
    timeout: 1 * 60 * 1000
  },
  reportSlowTests: null,
  workers: workerCount,
  reporter: resolveReporters(
    {
      defaultIndexFilename: 'xui-playwright-e2e.html',
      defaultProject: 'RPX XUI Manage Organisations - E2E',
      defaultRelease: appVersion,
      defaultTitle: 'RPX XUI Manage Organisations Playwright E2E',
      includeJunit: true
    },
    baseUrl,
    process.env
  ),
  use: {
    baseURL: baseUrl,
    ignoreHTTPSErrors: true,
    headless: headlessMode,
    trace: 'retain-on-failure',
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    video: 'off'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      }
    }
  ]
});
