import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const forbiddenLegacyScripts = [
  'test:a11y:codecept',
  'test:a11yInTest',
  'test:api',
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

export const cnpCompatibilityScripts = {
  'test:functional':
    'echo \'CNP functionalTest hook is intentionally satisfied by Playwright lanes in Jenkinsfile_CNP\' && exit 0',
  'test:fullfunctional':
    'echo \'CNP fullFunctionalTest hook is intentionally satisfied by Playwright lanes in Jenkinsfile_CNP/Jenkinsfile_nightly\' && exit 0'
};

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
    ['test:playwright:integration', 'npx playwright test --config=playwright.integration.config.ts'],
    ['test:accessibility:playwright', 'node scripts/run-playwright-accessibility.js'],
    ['test:wave-a11y:playwright', 'node scripts/run-playwright-wave-a11y.js'],
    ...Object.entries(cnpCompatibilityScripts)
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
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-accessibility/**/*junit.xml\')',
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-e2e/**/*junit.xml\')',
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-smoke/**/*junit.xml\')'
    ].join('\n')
  );

  fs.writeFileSync(
    path.join(rootDir, 'Jenkinsfile_nightly'),
    [
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-api/**/*junit.xml\')',
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-integration/**/*junit.xml\')',
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-accessibility/**/*junit.xml\')',
      'publishPlaywrightJUnit(\'functional-output/tests/playwright-e2e/**/*junit.xml\')',
      'playwrightAccessibility: {',
      '  stage(\'Playwright Accessibility Tests\') {',
      '    catchError(buildResult: \'SUCCESS\', stageResult: \'UNSTABLE\') {',
      '      try {',
      '        yarnBuilder.yarn(\'test:accessibility:playwright\')',
      '      } catch (Exception e) {',
      '        throw e',
      '      } finally {',
      '        publishPlaywrightAccessibilityReport(\'Nightly Manage Org Playwright Accessibility\')',
      '      }',
      '    }',
      '  }',
      '}'
    ].join('\n')
  );

  fs.writeFileSync(
    path.join(rootDir, 'Jenkinsfile_parameterized'),
    [
      'def playwrightAccessibilityOutputRoot = \'functional-output/tests/playwright-accessibility\'',
      'junit(allowEmptyResults: false, testResults: artifacts.replace(\'**\', \'**/*junit.xml\'))',
      'stagePlaywrightArtifacts(\'functional-output/tests/playwright-api/stable-artifacts\', \'test-results/playwright-api\')',
      'publishPlaywrightReport(\'functional-output/tests/playwright-api/odhin-report\', \'xui-mo-playwright-api.html\', \'API\', \'functional-output/tests/playwright-api/**\')',
      'sh \'yarn test:coverage:node\'',
      'publishPlaywrightReport(\'functional-output/tests/playwright-integration/odhin-report\', \'xui-mo-playwright-integration.html\', \'Integration\', \'functional-output/tests/playwright-integration/**\')',
      'publishPlaywrightReport(\'functional-output/tests/playwright-accessibility/odhin-report\', \'xui-playwright-accessibility.html\', \'Accessibility\', \'functional-output/tests/playwright-accessibility/**\')',
      'publishPlaywrightReport(\'functional-output/tests/playwright-e2e/odhin-report\', \'xui-playwright-e2e.html\', \'E2E\', \'functional-output/tests/playwright-e2e/**\')',
      'junit(allowEmptyResults: false, testResults: \'functional-output/tests/playwright-smoke/**/*junit.xml\')',
      'functional-output/tests/playwright-accessibility/odhin-report',
      'xui-playwright-accessibility.html',
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

  fs.writeFileSync(
    path.join(rootDir, 'scripts/run-playwright-accessibility.js'),
    [
      'assertNoGrepOverrides',
      'resolveSafeOutputRoot',
      'PLAYWRIGHT_INCLUDE_A11Y',
      'PLAYWRIGHT_INCLUDE_WAVE_A11Y',
      'PLAYWRIGHT_EXCLUDE_TAGS',
      'PLAYWRIGHT_TAGS',
      'PW_ODHIN_FORCE_EXIT_ON_COMPLETION',
      'PLAYWRIGHT_DISABLE_GENERIC_FAILURE_ARTIFACTS',
      'A11Y_STRICT',
      '--retries=0',
      '@a11y|@wave-a11y'
    ].join('\n')
  );

  fs.writeFileSync(
    path.join(rootDir, 'scripts/run-playwright-wave-a11y.js'),
    [
      'assertNoGrepOverrides',
      'resolveSafeOutputRoot',
      'PLAYWRIGHT_INCLUDE_WAVE_A11Y',
      'PLAYWRIGHT_EXCLUDE_TAGS',
      'PLAYWRIGHT_TAGS',
      'PW_ODHIN_FORCE_EXIT_ON_COMPLETION',
      'PLAYWRIGHT_DISABLE_GENERIC_FAILURE_ARTIFACTS',
      '--retries=0'
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
