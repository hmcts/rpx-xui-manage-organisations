import { defineConfig } from '@playwright/test';
import { load as loadDotenv } from 'dotenv-extended';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolveOutputDir, resolveReporters, resolveWorkerCount } from './playwright-reporting';

loadDotenv({
  defaults: '.env.example',
  errorOnExtra: false,
  errorOnMissing: false,
  includeProcessEnv: true,
  silent: true,
});

const baseUrl = process.env.TEST_URL || 'https://manage-org.aat.platform.hmcts.net/';
const workerCount = resolveWorkerCount(process.env);
const outputDir = resolveOutputDir(process.env);
const { version: appVersion } = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8')) as { version: string };

module.exports = defineConfig({
  outputDir,
  testDir: 'playwright_tests_new/integration',
  testMatch: ['**/*.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: 90 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  reportSlowTests: null,
  workers: workerCount,
  reporter: resolveReporters(
    {
      defaultIndexFilename: 'xui-mo-playwright-integration.html',
      defaultProject: 'RPX XUI Manage Organisations - Integration',
      defaultRelease: appVersion,
      defaultTitle: 'RPX XUI Manage Organisations Playwright Integration',
      htmlOutputFolder: 'functional-output/tests/playwright-integration',
      includeJunit: true,
    },
    baseUrl,
    process.env
  ),
  use: {
    baseURL: baseUrl,
    ignoreHTTPSErrors: true,
    screenshot: 'off',
    trace: 'off',
    video: 'off',
  },
});
