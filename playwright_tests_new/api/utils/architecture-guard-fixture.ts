import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const retiredLegacyScripts = [
  'test:a11y:codecept',
  'test:a11yInTest',
  'test:api',
  'test:ngIntegrationMockEnv',
  'test:codeceptE2EDebug',
  'test:codeceptE2E',
  'test:backendMock',
  'test:xuiIntegrationDebug',
  'test:xuiIntegration',
  'patch:static'
];

const legacyBridgeScripts = ['test:functional', 'test:fullfunctional'];

const activePlaywrightConfigFiles = [
  'playwright.config.ts',
  'playwright.e2e.config.ts',
  'playwright.integration.config.ts',
  'playwright-nightly.config.ts'
];

const activePipelineFiles = ['Jenkinsfile_CNP', 'Jenkinsfile_nightly'];

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
    ...retiredLegacyScripts.map((scriptName) => [
      scriptName,
      `node scripts/retired-codecept-runner.js fail ${scriptName}`
    ]),
    ...legacyBridgeScripts.map((scriptName) => [
      scriptName,
      `node scripts/retired-codecept-runner.js bridge ${scriptName}`
    ]),
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

  for (const fileName of activePipelineFiles) {
    fs.writeFileSync(
      path.join(rootDir, fileName),
      'steps.junit(allowEmptyResults: false, testResults: \'functional-output/tests/playwright-api/**/*junit.xml\')\n'
    );
  }

  fs.writeFileSync(
    path.join(rootDir, 'Jenkinsfile_parameterized'),
    [
      'stagePlaywrightArtifacts(\'functional-output/tests/playwright-api/stable-artifacts\', \'test-results/playwright-api\')',
      'sh \'yarn test:coverage:node\'',
      'junit(allowEmptyResults: false, testResults: \'functional-output/tests/playwright-smoke/**/*junit.xml\')',
      'functional-output/tests/playwright-a11y/integration/odhin-report',
      'xui-playwright-a11y-integration.html',
      'stagePlaywrightArtifacts',
      'reports/tests/coverage/node'
    ].join('\n')
  );

  fs.writeFileSync(
    path.join(rootDir, 'scripts/retired-codecept-runner.js'),
    'if (mode === \'bridge\' && bridgeCommands.has(command)) { process.exit(0); }\n'
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

export const runArchitectureGuard = (fixtureRoot: string): ReturnType<typeof spawnSync> =>
  spawnSync(process.execPath, [path.join(process.cwd(), 'scripts/check-playwright-architecture.js')], {
    cwd: fixtureRoot,
    encoding: 'utf8'
  });
