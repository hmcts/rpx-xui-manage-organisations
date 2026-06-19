#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const { rmSync } = require('node:fs');
const { homedir } = require('node:os');
const path = require('node:path');

const defaultFunctionalOutputRoot = 'functional-output/tests/playwright-accessibility';
const defaultTestOutputRoot = 'test-results/playwright-accessibility';
const accessibilityGrep = '(?:@a11y|@wave-a11y)';
const ownedOutputRoots = [
  path.resolve(defaultFunctionalOutputRoot),
  path.resolve(defaultTestOutputRoot)
];

const normalizePassthroughArgs = (argv) => argv.filter((arg) => arg !== '--');

const hasForbiddenGrepOverride = (arg) =>
  arg === '-g' ||
  arg === '--grep' ||
  arg === '--grep-invert' ||
  arg.startsWith('-g=') ||
  arg.startsWith('--grep=') ||
  arg.startsWith('--grep-invert=');

const assertNoGrepOverrides = (args) => {
  const override = args.find(hasForbiddenGrepOverride);
  if (override) {
    throw new Error(
      `Do not pass ${override} to test:accessibility:playwright. The accessibility runner owns the @a11y/@wave-a11y grep.`
    );
  }
};

const isWithin = (root, candidate) => {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};

const resolveSafeOutputRoot = (configuredPath, label) => {
  if (!configuredPath || configuredPath.trim() === '') {
    throw new Error(`${label} must not be empty.`);
  }

  const resolved = path.resolve(configuredPath);
  const unsafeRoots = new Set([path.resolve('.'), path.resolve(path.sep), homedir()]);
  if (unsafeRoots.has(resolved)) {
    throw new Error(`${label} resolves to ${resolved}; refusing to recursively delete that path.`);
  }

  if (!ownedOutputRoots.some((ownedRoot) => isWithin(ownedRoot, resolved))) {
    throw new Error(
      `${label} must stay under ${defaultFunctionalOutputRoot} or ${defaultTestOutputRoot}; received ${configuredPath}.`
    );
  }

  return configuredPath;
};

const isStrictMode = (env = process.env) => `${env.A11Y_STRICT || ''}`.toLowerCase() === 'true';

const buildRunPlan = (argv = process.argv.slice(2), env = process.env) => {
  const passthroughArgs = normalizePassthroughArgs(argv);
  assertNoGrepOverrides(passthroughArgs);

  const functionalOutputRoot = resolveSafeOutputRoot(
    env.PLAYWRIGHT_ACCESSIBILITY_OUTPUT_ROOT || defaultFunctionalOutputRoot,
    'PLAYWRIGHT_ACCESSIBILITY_OUTPUT_ROOT'
  );
  const testOutputRoot = resolveSafeOutputRoot(
    env.PLAYWRIGHT_TEST_OUTPUT_DIR || defaultTestOutputRoot,
    'PLAYWRIGHT_TEST_OUTPUT_DIR'
  );

  const e2eEnv = {
    PLAYWRIGHT_TEST_OUTPUT_DIR: testOutputRoot,
    PLAYWRIGHT_HTML_OUTPUT: env.PLAYWRIGHT_HTML_OUTPUT || `${functionalOutputRoot}/html-report`,
    PLAYWRIGHT_JUNIT_OUTPUT:
      env.PLAYWRIGHT_JUNIT_OUTPUT || `${functionalOutputRoot}/playwright-accessibility-junit.xml`,
    PLAYWRIGHT_REPORT_FOLDER: env.PLAYWRIGHT_REPORT_FOLDER || `${functionalOutputRoot}/odhin-report`,
    PLAYWRIGHT_REPORT_INDEX_FILENAME:
      env.PLAYWRIGHT_REPORT_INDEX_FILENAME || 'xui-playwright-accessibility.html',
    PLAYWRIGHT_REPORT_PROJECT: env.PLAYWRIGHT_REPORT_PROJECT || 'RPX XUI Manage Organisations - Accessibility',
    PLAYWRIGHT_REPORT_TITLE:
      env.PLAYWRIGHT_REPORT_TITLE || 'RPX XUI Manage Organisations Playwright Accessibility',
    PLAYWRIGHT_DISABLE_GENERIC_FAILURE_ARTIFACTS: 'true'
  };

  return {
    functionalOutputRoot,
    passthroughArgs,
    runs: [
      {
        args: ['test:playwrightE2E:list', '--grep', accessibilityGrep, ...passthroughArgs],
        env: e2eEnv,
        label: 'E2E accessibility discovery'
      },
      {
        args: [
          'test:playwrightE2E:raw',
          '--',
          '--grep',
          accessibilityGrep,
          ...passthroughArgs,
          '--retries=0'
        ],
        env: e2eEnv,
        label: 'E2E accessibility execution'
      }
    ],
    testOutputRoot
  };
};

const runYarn = (label, args, envOverrides, env = process.env, spawn = spawnSync) => {
  console.log(`[playwright-accessibility] ${label}`);

  const result = spawn('yarn', args, {
    env: {
      ...env,
      FUNCTIONAL_TESTS_WORKERS: env.PW_ACCESSIBILITY_WORKERS || env.FUNCTIONAL_TESTS_WORKERS || '6',
      ...envOverrides,
      PLAYWRIGHT_INCLUDE_A11Y: 'true',
      PLAYWRIGHT_INCLUDE_WAVE_A11Y: 'true',
      PLAYWRIGHT_EXCLUDE_TAGS: '',
      PLAYWRIGHT_TAGS: '',
      PW_ODHIN_FORCE_EXIT_ON_COMPLETION: env.PW_ODHIN_FORCE_EXIT_ON_COMPLETION || 'true'
    },
    shell: process.platform === 'win32',
    stdio: 'inherit'
  });

  if (result.error) {
    throw result.error;
  }

  if (result.signal) {
    console.error(`[playwright-accessibility] ${label} terminated by signal ${result.signal}`);
    return 1;
  }

  return result.status ?? 1;
};

const main = (argv = process.argv.slice(2), env = process.env) => {
  let plan;
  try {
    plan = buildRunPlan(argv, env);
  } catch (error) {
    console.error(`[playwright-accessibility] ${error.message}`);
    return 1;
  }

  rmSync(plan.functionalOutputRoot, { force: true, recursive: true });
  rmSync(plan.testOutputRoot, { force: true, recursive: true });

  for (const run of plan.runs) {
    const status = runYarn(run.label, run.args, run.env, env);
    if (status !== 0) {
      if (!isStrictMode(env)) {
        console.warn(
          `[playwright-accessibility] ${run.label} returned ${status}; report-only mode keeps this non-blocking. Set A11Y_STRICT=true to fail.`
        );
        return 0;
      }
      return status;
    }
  }

  return 0;
};

if (require.main === module) {
  process.exit(main());
}

module.exports = {
  assertNoGrepOverrides,
  buildRunPlan,
  isStrictMode,
  normalizePassthroughArgs,
  resolveSafeOutputRoot,
  runYarn
};
