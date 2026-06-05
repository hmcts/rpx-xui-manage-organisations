import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const forbiddenLegacyScripts = [
  'test:a11y:codecept',
  'test:a11yInTest',
  'test:api',
  'test:functional',
  'test:fullfunctional',
  'test:mutation',
  'test:mutation:fix',
  'test:ngIntegrationMockEnv',
  'test:codeceptE2EDebug',
  'test:codeceptE2E',
  'test:backendMock',
  'test:xuiIntegrationDebug',
  'test:xuiIntegration',
  'testx',
  'patch:static'
];

const activePlaywrightConfigFiles = [
  'playwright.config.ts',
  'playwright.e2e.config.ts',
  'playwright.integration.config.ts',
  'playwright-nightly.config.ts'
];

export const updateJsonFile = (
  filePath: string,
  update: (contents: Record<string, unknown>) => Record<string, unknown>
): void => {
  const contents = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  fs.writeFileSync(filePath, `${JSON.stringify(update(contents), null, 2)}\n`);
};

export const createArchitectureGuardFixture = (): string => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-architecture-guard-'));
  const scripts = Object.fromEntries([
    ['test:playwrightE2E', 'npx playwright test --config=playwright.e2e.config.ts'],
    ['test:playwright:integration', 'npx playwright test --config=playwright.integration.config.ts']
  ]);

  fs.mkdirSync(path.join(rootDir, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(rootDir, 'playwright_tests_new/api/unit'), { recursive: true });

  fs.writeFileSync(
    path.join(rootDir, 'package.json'),
    `${JSON.stringify({ dependencies: {}, devDependencies: {}, resolutions: {}, scripts }, null, 2)}\n`
  );

  for (const fileName of activePlaywrightConfigFiles) {
    fs.writeFileSync(path.join(rootDir, fileName), 'export default { testDir: \'./playwright_tests_new\' };\n');
  }

  fs.writeFileSync(
    path.join(rootDir, 'Jenkinsfile_CNP'),
    [
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-api/**/*junit.xml\')',
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-integration/**/*junit.xml\')',
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-a11y/**/*junit.xml\')',
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-e2e/**/*junit.xml\')',
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-smoke/**/*junit.xml\')'
    ].join('\n')
  );

  fs.writeFileSync(
    path.join(rootDir, 'Jenkinsfile_nightly'),
    [
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-api/**/*junit.xml\')',
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-integration/**/*junit.xml\')',
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-a11y/**/*junit.xml\')',
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-e2e/**/*junit.xml\')'
    ].join('\n')
  );

  fs.writeFileSync(
    path.join(rootDir, 'Jenkinsfile_parameterized'),
    [
      'junit(allowEmptyResults: false, testResults: artifacts.replace(\'**\', \'**/*junit.xml\'))',
      'stagePlaywrightArtifacts(\'functional-output/tests/playwright-api/stable-artifacts\', \'test-results/playwright-api\')',
      'publishPlaywrightReport(\'functional-output/tests/playwright-api/odhin-report\', \'xui-mo-playwright-api.html\', \'API\', \'functional-output/tests/playwright-api/**\')',
      'sh \'yarn test:coverage:node\'',
      'publishPlaywrightReport(\'functional-output/tests/playwright-integration/odhin-report\', \'xui-mo-playwright-integration.html\', \'Integration\', \'functional-output/tests/playwright-integration/**\')',
      'publishPlaywrightReport(\'functional-output/tests/playwright-a11y/odhin-report\', \'xui-playwright-a11y.html\', \'A11y\', \'functional-output/tests/playwright-a11y/**\')',
      'publishPlaywrightReport(\'functional-output/tests/playwright-e2e/odhin-report\', \'xui-playwright-e2e.html\', \'E2E\', \'functional-output/tests/playwright-e2e/**\')',
      'junit(allowEmptyResults: false, testResults: \'functional-output/tests/playwright-smoke/**/*junit.xml\')',
      'functional-output/tests/playwright-a11y/integration/odhin-report',
      'xui-playwright-a11y-integration.html',
      'stagePlaywrightArtifacts',
      'reports/tests/coverage/node'
    ].join('\n')
  );

  fs.writeFileSync(
    path.join(rootDir, 'scripts/run-playwright-a11y.js'),
    [
      'assertNoGrepOverrides',
      'resolveSafeOutputRoot',
      'PLAYWRIGHT_EXCLUDE_TAGS',
      'PLAYWRIGHT_TAGS',
      'PW_ODHIN_FORCE_EXIT_ON_COMPLETION'
    ].join('\n')
  );

  return rootDir;
};

export const forbiddenPackageScripts = forbiddenLegacyScripts;

export const runArchitectureGuard = (fixtureRoot: string): ReturnType<typeof spawnSync> =>
  spawnSync(process.execPath, [path.join(process.cwd(), 'scripts/check-playwright-architecture.js')], {
    cwd: fixtureRoot,
    encoding: 'utf8'
  });
