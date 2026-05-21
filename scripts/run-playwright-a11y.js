#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const { rmSync } = require('node:fs');

const passthroughArgs = process.argv.slice(2).filter((arg) => arg !== '--');
const functionalOutputRoot = process.env.PLAYWRIGHT_A11Y_OUTPUT_ROOT || 'functional-output/tests/playwright-a11y';
const testOutputRoot = process.env.PLAYWRIGHT_TEST_OUTPUT_DIR || 'test-results/playwright-a11y';

rmSync(functionalOutputRoot, { force: true, recursive: true });
rmSync(testOutputRoot, { force: true, recursive: true });

const runYarn = (label, args, envOverrides) => {
  console.log(`[playwright-a11y] ${label}`);

  const result = spawnSync('yarn', args, {
    env: {
      ...process.env,
      FUNCTIONAL_TESTS_WORKERS: process.env.FUNCTIONAL_TESTS_WORKERS || '4',
      PLAYWRIGHT_INCLUDE_A11Y: 'true',
      ...envOverrides
    },
    shell: process.platform === 'win32',
    stdio: 'inherit'
  });

  if (result.error) {
    throw result.error;
  }

  if (result.signal) {
    console.error(`[playwright-a11y] ${label} terminated by signal ${result.signal}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const e2eEnv = {
  PLAYWRIGHT_TEST_OUTPUT_DIR: testOutputRoot,
  PLAYWRIGHT_HTML_OUTPUT: process.env.PLAYWRIGHT_HTML_OUTPUT || `${functionalOutputRoot}/html-report`,
  PLAYWRIGHT_JUNIT_OUTPUT: process.env.PLAYWRIGHT_JUNIT_OUTPUT || `${functionalOutputRoot}/playwright-a11y-junit.xml`,
  PLAYWRIGHT_REPORT_FOLDER: process.env.PLAYWRIGHT_REPORT_FOLDER || `${functionalOutputRoot}/odhin-report`,
  PLAYWRIGHT_REPORT_INDEX_FILENAME: process.env.PLAYWRIGHT_REPORT_INDEX_FILENAME || 'xui-playwright-a11y.html',
  PLAYWRIGHT_REPORT_PROJECT: process.env.PLAYWRIGHT_REPORT_PROJECT || 'RPX XUI Manage Organisations - Accessibility',
  PLAYWRIGHT_REPORT_TITLE: process.env.PLAYWRIGHT_REPORT_TITLE || 'RPX XUI Manage Organisations Playwright A11y'
};

const integrationEnv = {
  PLAYWRIGHT_TEST_OUTPUT_DIR: `${testOutputRoot}/integration`,
  PLAYWRIGHT_HTML_OUTPUT: `${functionalOutputRoot}/integration/html-report`,
  PLAYWRIGHT_JUNIT_OUTPUT: `${functionalOutputRoot}/integration/playwright-a11y-integration-junit.xml`,
  PLAYWRIGHT_REPORT_FOLDER: `${functionalOutputRoot}/integration/odhin-report`,
  PLAYWRIGHT_REPORT_INDEX_FILENAME: 'xui-playwright-a11y-integration.html',
  PLAYWRIGHT_REPORT_PROJECT: 'RPX XUI Manage Organisations - Integration Accessibility',
  PLAYWRIGHT_REPORT_TITLE: 'RPX XUI Manage Organisations Playwright Integration A11y'
};

runYarn('E2E a11y discovery', ['test:playwrightE2E:list', '--grep', '@a11y', ...passthroughArgs], e2eEnv);
runYarn('E2E a11y execution', ['test:playwrightE2E:raw', '--', '--grep', '@a11y', ...passthroughArgs], e2eEnv);
runYarn(
  'integration a11y discovery',
  ['test:playwright:integration:raw', '--', '--list', '--grep', '@a11y', ...passthroughArgs],
  integrationEnv
);
runYarn(
  'integration a11y execution',
  ['test:playwright:integration:raw', '--', '--grep', '@a11y', ...passthroughArgs],
  integrationEnv
);
