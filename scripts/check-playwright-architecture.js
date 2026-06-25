const { existsSync, readdirSync, readFileSync, statSync } = require('node:fs');
const { join, relative, sep } = require('node:path');

const root = process.cwd();
const playwrightRoot = join(root, 'playwright_tests_new');
const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
const allowedAssertionFiles = [
  /^playwright_tests_new\/E2E\/test\/.*\.(spec|test)\.ts$/,
  /^playwright_tests_new\/api\/[^/]+\.api\.ts$/,
  /^playwright_tests_new\/api\/unit\/.*\.unit\.api\.ts$/,
  /^playwright_tests_new\/integration\/test\/.*\.spec\.ts$/
];
const forbiddenLegacyScripts = [
  'test:a11y:codecept',
  'test:a11yInTest',
  'test:api',
  'test:mutation',
  'test:mutation:fix',
  'test:ngIntegrationMockEnv',
  'test:api:pw:mutating',
  'test:codeceptE2EDebug',
  'test:codeceptE2E',
  'test:backendMock',
  'test:xuiIntegrationDebug',
  'test:xuiIntegration',
  'testx',
  'patch:static'
];
const cnpCompatibilityScripts = {
  'test:functional':
    "echo 'CNP functionalTest hook is intentionally satisfied by Playwright lanes in Jenkinsfile_CNP' && exit 0",
  'test:fullfunctional':
    "echo 'CNP fullFunctionalTest hook is intentionally satisfied by Playwright lanes in Jenkinsfile_CNP/Jenkinsfile_nightly' && exit 0"
};
const forbiddenLegacyDirectories = [
  'test_codecept',
  'playwright_tests',
  'test/accessibility',
  'test/integration',
  'test/nodeMock'
];
const forbiddenLegacyDependencies = [
  '@types/faker',
  '@types/jasminewd2',
  'allure-js-commons',
  'codeceptjs',
  'codeceptjs-cucumber-json-reporter',
  'cucumber-html-report',
  'cucumber-html-reporter',
  'faker',
  'mochawesome',
  'pa11y',
  'pa11y-reporter-html',
  'portfinder',
  'puppeteer',
  'rest-assured',
  'should',
  'start-server-and-test',
  'why-is-node-running'
];
const activePlaywrightConfigFiles = [
  'playwright.config.ts',
  'playwright.e2e.config.ts',
  'playwright.integration.config.ts',
  'playwright-nightly.config.ts'
];
const activePipelineFiles = [
  'Jenkinsfile_CNP',
  'Jenkinsfile_nightly',
  'Jenkinsfile_parameterized'
];
const parameterizedPipelineFile = 'Jenkinsfile_parameterized';
const requiredPipelineBehaviorContracts = [
  {
    fileName: 'Jenkinsfile_nightly',
    contracts: [
      {
        label: 'non-blocking nightly accessibility branch',
        pattern:
          /playwrightAccessibility:\s*\{[\s\S]*?stage\(['"]Playwright Accessibility Tests['"]\)\s*\{[\s\S]*?catchError\(buildResult:\s*['"]SUCCESS['"],\s*stageResult:\s*['"]UNSTABLE['"]\)\s*\{[\s\S]*?yarnBuilder\.yarn\(['"]test:accessibility:playwright['"]\)[\s\S]*?throw e[\s\S]*?publishPlaywrightAccessibilityReport\(['"]Nightly Manage Org Playwright Accessibility['"]\)/
      }
    ]
  }
];
const requiredPipelineJunitContracts = [
  {
    fileName: 'Jenkinsfile_CNP',
    contracts: [
      {
        label: 'API JUnit publication',
        pattern: /publishPlaywrightJUnit\(['"]functional-output\/tests\/playwright-api\/\*\*\/\*junit\.xml['"]\)/
      },
      {
        label: 'integration JUnit publication',
        pattern: /publishPlaywrightJUnit\(['"]functional-output\/tests\/playwright-integration\/\*\*\/\*junit\.xml['"]\)/
      },
      {
        label: 'unified accessibility JUnit publication',
        pattern: /publishPlaywrightJUnit\((['"]functional-output\/tests\/playwright-accessibility\/\*\*\/\*junit\.xml['"]|["']?\$\{playwrightAccessibilityOutputRoot\}\/\*\*\/\*junit\.xml["']?)\)/
      },
      {
        label: 'E2E JUnit publication',
        pattern: /publishPlaywrightJUnit\(['"]functional-output\/tests\/playwright-e2e\/\*\*\/\*junit\.xml['"]\)/
      },
      {
        label: 'smoke JUnit publication',
        pattern: /publishPlaywrightJUnit\(['"]functional-output\/tests\/playwright-smoke\/\*\*\/\*junit\.xml['"]\)/
      }
    ]
  },
  {
    fileName: 'Jenkinsfile_nightly',
    contracts: [
      {
        label: 'API JUnit publication',
        pattern: /publishPlaywrightJUnit\(['"]functional-output\/tests\/playwright-api\/\*\*\/\*junit\.xml['"]\)/
      },
      {
        label: 'integration JUnit publication',
        pattern: /publishPlaywrightJUnit\(['"]functional-output\/tests\/playwright-integration\/\*\*\/\*junit\.xml['"]\)/
      },
      {
        label: 'unified accessibility JUnit publication',
        pattern: /publishPlaywrightJUnit\((['"]functional-output\/tests\/playwright-accessibility\/\*\*\/\*junit\.xml['"]|["']?\$\{playwrightAccessibilityOutputRoot\}\/\*\*\/\*junit\.xml["']?)\)/
      },
      {
        label: 'E2E JUnit publication',
        pattern: /publishPlaywrightJUnit\(['"]functional-output\/tests\/playwright-e2e\/\*\*\/\*junit\.xml['"]\)/
      }
    ]
  },
  {
    fileName: 'Jenkinsfile_parameterized',
    contracts: [
      {
        label: 'shared lane JUnit publisher',
        pattern: /junit\(\s*allowEmptyResults:\s*false,\s*testResults:\s*artifacts\.replace\(['"]\*\*['"],\s*['"]\*\*\/\*junit\.xml['"]\)\s*\)/
      },
      { label: 'API artifact root', pattern: /functional-output\/tests\/playwright-api\/\*\*/ },
      { label: 'integration artifact root', pattern: /functional-output\/tests\/playwright-integration\/\*\*/ },
      {
        label: 'unified accessibility artifact root',
        pattern: /functional-output\/tests\/playwright-accessibility\/\*\*|\$\{playwrightAccessibilityOutputRoot\}\/\*\*/
      },
      { label: 'E2E artifact root', pattern: /functional-output\/tests\/playwright-e2e\/\*\*/ },
      {
        label: 'smoke JUnit publication',
        pattern: /junit\(allowEmptyResults:\s*false,\s*testResults:\s*['"]functional-output\/tests\/playwright-smoke\/\*\*\/\*junit\.xml['"]\)/
      }
    ]
  }
];
const retiredExecutionPatterns = [
  { pattern: /\bnpx\s+codeceptjs\b/, label: 'CodeceptJS runner' },
  { pattern: /\bcodeceptjs\s+run(?:-workers)?\b/, label: 'CodeceptJS runner' },
  { pattern: /\bts-node\s+\.\/test_codecept\/integration\/tests\/test\.ts\b/, label: 'legacy API functional runner' },
  { pattern: /test_codecept\/backendMock\/app\b/, label: 'legacy Codecept backend mock' },
  { pattern: /test_codecept\/scripts\/patchBuild\.js\b/, label: 'legacy static patch runner' },
  { pattern: /ensure-codecept-a11y-report\.js\b/, label: 'legacy Codecept a11y report shim' },
  { pattern: /\bpa11y\b/, label: 'legacy pa11y runner' }
];
const oldPlaywrightPathPattern = {
  pattern: /(^|[^A-Za-z0-9_])playwright_tests(?:\/|(?=$|[^A-Za-z0-9_]))/,
  label: 'legacy playwright_tests path'
};
const forbiddenPipelineScriptPatterns = [
  {
    pattern: /yarnBuilder\.yarn\(['"]test:(?:codeceptE2E|xuiIntegration|ngIntegrationMockEnv|a11yInTest|a11y:codecept|api|backendMock|functional|fullfunctional)['"]\)/,
    label: 'legacy yarnBuilder test stage'
  },
  {
    pattern: /\byarn\s+(?:run\s+)?test:(?:codeceptE2E|xuiIntegration|ngIntegrationMockEnv|a11yInTest|a11y:codecept|api|backendMock|functional|fullfunctional)(?=\s|['")]|$)/,
    label: 'legacy yarn test command'
  },
  {
    pattern: /reports\/tests\/(?:functional|api_functional|a11y)\//,
    label: 'legacy functional report publisher'
  },
  {
    pattern: /allowEmptyResults\s*:\s*true/,
    label: 'optional JUnit publisher for required Playwright evidence'
  }
];
const checkedExtensions = new Set(['.ts', '.js', '.cjs', '.mjs']);

const failures = [];

const extensionFor = (filePath) => {
  const match = filePath.match(/(\.[^.]+)$/);
  return match ? match[1] : '';
};

const isAllowedAssertionFile = (filePath) =>
  allowedAssertionFiles.some((allowedAssertionFile) => allowedAssertionFile.test(filePath));

for (const directory of forbiddenLegacyDirectories) {
  if (existsSync(join(root, directory))) {
    failures.push(`${directory}: retired legacy test assets must stay deleted; use playwright_tests_new/** coverage.`);
  }
}

for (const dependencySection of ['dependencies', 'devDependencies', 'resolutions']) {
  for (const dependencyName of forbiddenLegacyDependencies) {
    if (packageJson[dependencySection]?.[dependencyName]) {
      failures.push(`${dependencySection}.${dependencyName}: retired legacy test dependency must not be reintroduced.`);
    }
  }
}

const walk = (directory, files = []) => {
  if (!existsSync(directory)) {
    return files;
  }

  for (const entry of readdirSync(directory)) {
    const entryPath = join(directory, entry);
    const stats = statSync(entryPath);
    if (stats.isDirectory()) {
      walk(entryPath, files);
    } else if (checkedExtensions.has(extensionFor(entryPath))) {
      files.push(entryPath);
    }
  }

  return files;
};

for (const filePath of walk(playwrightRoot)) {
  const relativePath = relative(root, filePath).split(sep).join('/');
  const source = readFileSync(filePath, 'utf-8');

  if (/\/utils\/assertions\.[cm]?[jt]s$/.test(relativePath) || /\/assertions\.[cm]?[jt]s$/.test(relativePath)) {
    failures.push(`${relativePath}: assertion helper modules hide test verdicts; keep Playwright assertions in specs/API tests.`);
  }

  if (!isAllowedAssertionFile(relativePath) && /\bexpect\s*\(/.test(source)) {
    failures.push(`${relativePath}: contains expect(...). Page objects, fixtures and utilities must not own business assertions.`);
  }

  if (/\/page-objects\//.test(relativePath) && /\bexpect\b/.test(source)) {
    failures.push(`${relativePath}: page objects must not import or re-export Playwright expect.`);
  }

  if (/^playwright_tests_new\/api\/.*\.api\.ts$/.test(relativePath) && /\b(?:test|describe)\.skip\s*\(/.test(source)) {
    failures.push(`${relativePath}: API tests must not be skipped; remove non-executable scenarios or make them pass.`);
  }
}

for (const scriptName of forbiddenLegacyScripts) {
  if (packageJson.scripts?.[scriptName]) {
    failures.push(`${scriptName}: retired package script must stay removed; use the Playwright replacement lanes.`);
  }
}

for (const [scriptName, expectedCommand] of Object.entries(cnpCompatibilityScripts)) {
  const actualCommand = packageJson.scripts?.[scriptName];
  if (actualCommand !== expectedCommand) {
    failures.push(`${scriptName}: CNP compatibility hook must remain a no-op and must not execute legacy tests.`);
  }
}

for (const [scriptName, expectedCommand] of Object.entries({
  'test:accessibility:playwright': 'node scripts/run-playwright-accessibility.js',
  'test:wave-a11y:playwright': 'node scripts/run-playwright-wave-a11y.js'
})) {
  const actualCommand = packageJson.scripts?.[scriptName];
  if (actualCommand !== expectedCommand) {
    failures.push(`${scriptName}: accessibility pack must keep its dedicated Playwright runner.`);
  }
}

for (const [scriptName, command] of Object.entries(packageJson.scripts ?? {})) {
  for (const { pattern, label } of [...retiredExecutionPatterns, oldPlaywrightPathPattern]) {
    if (pattern.test(command)) {
      failures.push(`${scriptName}: invokes ${label}; retained legacy assets must not be executed.`);
    }
  }
}

for (const fileName of activePlaywrightConfigFiles) {
  const configSource = readFileSync(join(root, fileName), 'utf-8');
  if (oldPlaywrightPathPattern.pattern.test(configSource)) {
    failures.push(`${fileName}: active Playwright configs must select playwright_tests_new/**, not legacy playwright_tests/**.`);
  }
}

for (const fileName of activePipelineFiles) {
  const pipelineSource = readFileSync(join(root, fileName), 'utf-8');
  for (const { pattern, label } of [
    ...retiredExecutionPatterns,
    ...forbiddenPipelineScriptPatterns,
    oldPlaywrightPathPattern
  ]) {
    if (pattern.test(pipelineSource)) {
      failures.push(`${fileName}: contains ${label}; pipelines must run only Playwright retirement lanes.`);
    }
  }
}

for (const { fileName, contracts } of requiredPipelineJunitContracts) {
  const pipelineSource = readFileSync(join(root, fileName), 'utf-8');
  for (const { pattern, label } of contracts) {
    if (!pattern.test(pipelineSource)) {
      failures.push(`${fileName}: missing required Playwright JUnit evidence contract ${label}.`);
    }
  }
}

for (const { fileName, contracts } of requiredPipelineBehaviorContracts) {
  const pipelineSource = readFileSync(join(root, fileName), 'utf-8');
  for (const { pattern, label } of contracts) {
    if (!pattern.test(pipelineSource)) {
      failures.push(`${fileName}: missing required Playwright pipeline behavior contract ${label}.`);
    }
  }
}

if (existsSync(join(root, 'scripts/retired-codecept-runner.js'))) {
  failures.push('scripts/retired-codecept-runner.js: retired compatibility runner must stay deleted.');
}

const a11yRunnerSource = readFileSync(join(root, 'scripts/run-playwright-a11y.js'), 'utf-8');
for (const expectedContract of [
  'assertNoGrepOverrides',
  'resolveSafeOutputRoot',
  'PLAYWRIGHT_EXCLUDE_TAGS',
  'PLAYWRIGHT_TAGS',
  'PW_ODHIN_FORCE_EXIT_ON_COMPLETION'
]) {
  if (!a11yRunnerSource.includes(expectedContract)) {
    failures.push(`scripts/run-playwright-a11y.js: missing a11y runner hardening contract ${expectedContract}.`);
  }
}

const waveA11yRunnerSource = [
  readFileSync(join(root, 'scripts/run-playwright-wave-a11y.js'), 'utf-8'),
  readFileSync(join(root, 'scripts/run-playwright-accessibility.js'), 'utf-8')
].join('\n');
for (const expectedContract of [
  'assertNoGrepOverrides',
  'resolveSafeOutputRoot',
  'PLAYWRIGHT_INCLUDE_WAVE_A11Y',
  'PLAYWRIGHT_EXCLUDE_TAGS',
  'PLAYWRIGHT_TAGS',
  'PW_ODHIN_FORCE_EXIT_ON_COMPLETION',
  'PLAYWRIGHT_DISABLE_GENERIC_FAILURE_ARTIFACTS',
  '--retries=0'
]) {
  if (!waveA11yRunnerSource.includes(expectedContract)) {
    failures.push(
      `scripts/run-playwright-wave-a11y.js: missing WAVE-like a11y runner hardening contract ${expectedContract}.`
    );
  }
}

const accessibilityRunnerSource = readFileSync(join(root, 'scripts/run-playwright-accessibility.js'), 'utf-8');
for (const expectedContract of [
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
]) {
  if (!accessibilityRunnerSource.includes(expectedContract)) {
    failures.push(
      `scripts/run-playwright-accessibility.js: missing unified accessibility runner hardening contract ${expectedContract}.`
    );
  }
}

const parameterizedPipelineSource = readFileSync(join(root, parameterizedPipelineFile), 'utf-8');
for (const expectedEvidencePath of [
  'playwrightAccessibilityOutputRoot',
  'xui-playwright-accessibility.html',
  'stagePlaywrightArtifacts',
  "sh 'yarn test:coverage:node'",
  'reports/tests/coverage/node'
]) {
  if (!parameterizedPipelineSource.includes(expectedEvidencePath)) {
    failures.push(`${parameterizedPipelineFile}: missing Playwright retirement evidence contract ${expectedEvidencePath}.`);
  }
}

if (failures.length > 0) {
  console.error('Playwright architecture guard failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}
