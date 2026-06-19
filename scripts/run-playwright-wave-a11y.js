#!/usr/bin/env node

const {
  assertNoGrepOverrides,
  buildRunPlan,
  resolveSafeOutputRoot,
  runAccessibilityPack
} = require('./run-playwright-accessibility');

const WAVE_OPTIONS = {
  discoveryLabel: 'E2E WAVE-like a11y discovery',
  envOverrides: {
    PLAYWRIGHT_INCLUDE_A11Y: '',
    PLAYWRIGHT_INCLUDE_WAVE_A11Y: 'true',
    PLAYWRIGHT_EXCLUDE_TAGS: '',
    PLAYWRIGHT_TAGS: '@wave-a11y'
  },
  executionLabel: 'E2E WAVE-like a11y execution',
  functionalOutputEnv: 'PLAYWRIGHT_WAVE_A11Y_OUTPUT_ROOT',
  functionalOutputRoot: 'functional-output/tests/playwright-wave-a11y',
  grep: '@wave-a11y',
  junitFile: 'playwright-wave-a11y-junit.xml',
  reportIndex: 'xui-playwright-wave-a11y.html',
  reportOnlyExecution: false,
  reportProject: 'RPX XUI Manage Organisations - WAVE-like Accessibility',
  reportTitle: 'RPX XUI Manage Organisations Playwright WAVE-like A11y',
  testOutputRoot: 'test-results/playwright-wave-a11y'
};

const main = (argv = process.argv.slice(2), env = process.env) => runAccessibilityPack(argv, env, WAVE_OPTIONS);

if (require.main === module) {
  process.exit(main());
}

module.exports = {
  assertNoGrepOverrides,
  buildRunPlan: (argv, env) => buildRunPlan(argv, env, WAVE_OPTIONS),
  main,
  resolveSafeOutputRoot: (configuredPath, label) =>
    resolveSafeOutputRoot(configuredPath, label, [WAVE_OPTIONS.functionalOutputRoot, WAVE_OPTIONS.testOutputRoot])
};
