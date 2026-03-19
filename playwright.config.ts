import { defineConfig, devices } from '@playwright/test';

const headlessMode = process.env.HEAD !== 'true';
export const axeTestEnabled = process.env.ENABLE_AXE_TESTS === 'true';
const smokeSpecPattern = 'playwright_tests_new/E2E/test/smoke/smokeTest.spec.ts';

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
    ['html', { open: 'never', outputFolder: 'functional-output/tests/playwright-e2e' }]],

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
