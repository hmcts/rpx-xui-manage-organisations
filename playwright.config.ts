import { defineConfig, devices } from '@playwright/test';

const headlessMode = process.env.HEAD !== 'true';
export const axeTestEnabled = process.env.ENABLE_AXE_TESTS === 'true';
const smokeSpecPattern = 'playwright_tests_new/E2E/test/smoke/smokeTest.spec.ts';
const odhinOutputFolder = process.env.PW_ODHIN_OUTPUT ?? 'functional-output/tests/playwright-e2e/odhin-report';
const odhinIndexFilename = process.env.PW_ODHIN_INDEX ?? 'xui-playwright-e2e.html';
const odhinTitle = process.env.PW_ODHIN_TITLE ?? 'RPX XUI Manage Organisations Playwright';
const odhinEnvironment = process.env.PW_ODHIN_ENV ?? (process.env.CI ? 'ci' : 'local');
const odhinProject = process.env.PW_ODHIN_PROJECT ?? 'RPX XUI Manage Organisations';
const odhinRelease = process.env.PW_ODHIN_RELEASE ?? 'manage-org-playwright';

module.exports = defineConfig({
  use: {
    baseURL: process.env.TEST_URL || 'http://localhost:3000/'
  },
  testDir: '.',
  testMatch: [
    'playwright_tests/**/*.test.ts',
    'playwright_tests_new/E2E/**/*.spec.ts'
  ],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 3, // Set the number of retries for all projects

  timeout: 3 * 60 * 1000,
  expect: {
    timeout: 1 * 60 * 1000
  },
  reportSlowTests: null,

  /* Opt out of parallel tests on CI. */
  workers: process.env.FUNCTIONAL_TESTS_WORKERS ? parseInt(process.env.FUNCTIONAL_TESTS_WORKERS, 10) : 1,

  reporter: [[process.env.CI ? 'dot' : 'list'],
    ['html', { open: 'never', outputFolder: 'functional-output/tests/playwright-e2e' }],
    ['odhin-reports-playwright', {
      outputFolder: odhinOutputFolder,
      indexFilename: odhinIndexFilename,
      title: odhinTitle,
      testEnvironment: odhinEnvironment,
      project: odhinProject,
      release: odhinRelease,
      startServer: false,
      consoleLog: true,
      consoleError: true,
      testOutput: 'only-on-failure'
    }]],

  projects: [
    {
      name: 'chromium',
      testIgnore: [smokeSpecPattern],
      use: { ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: headlessMode,
        trace: 'on-first-retry'
      }
    },
    {
      name: 'firefox',
      testIgnore: [smokeSpecPattern],
      use: { ...devices['Desktop Firefox'],
        screenshot: 'only-on-failure',
        headless: headlessMode,
        trace: 'off'
      }
    },
    {
      name: 'webkit',
      testIgnore: [smokeSpecPattern],
      use: {
        screenshot: 'only-on-failure',
        headless: headlessMode,
        trace: 'off'
      }
    },
    {
      name: 'smoke',
      testMatch: [smokeSpecPattern],
      use: { ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: headlessMode,
        screenshot: 'only-on-failure',
        trace: 'on-first-retry'
      }
    }
  ]
});
