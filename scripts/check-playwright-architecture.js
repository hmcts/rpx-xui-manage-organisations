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
const activePipelineFiles = [
  'Jenkinsfile_CNP',
  'Jenkinsfile_nightly',
  'Jenkinsfile_parameterized'
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
  pattern: /(^|[^A-Za-z0-9_])playwright_tests\//,
  label: 'legacy playwright_tests path'
};
const forbiddenPipelineScriptPatterns = [
  {
    pattern: /yarnBuilder\.yarn\(['"]test:(?:codeceptE2E|xuiIntegration|ngIntegrationMockEnv|a11yInTest|a11y:codecept|api|backendMock|functional|fullfunctional)['"]\)/,
    label: 'legacy yarnBuilder test stage'
  },
  {
    pattern: /\byarn\s+(?:run\s+)?test:(?:codeceptE2E|xuiIntegration|ngIntegrationMockEnv|a11yInTest|a11y:codecept|api|backendMock|functional|fullfunctional)(?:\s|$)/,
    label: 'legacy yarn test command'
  },
  {
    pattern: /reports\/tests\/(?:functional|api_functional|a11y)\//,
    label: 'legacy functional report publisher'
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
}

for (const scriptName of retiredLegacyScripts) {
  const expectedCommand = `node scripts/retired-codecept-runner.js fail ${scriptName}`;
  if (packageJson.scripts?.[scriptName] !== expectedCommand) {
    failures.push(`${scriptName}: legacy command must fail fast through scripts/retired-codecept-runner.js.`);
  }
}

for (const scriptName of legacyBridgeScripts) {
  const expectedCommand = `node scripts/retired-codecept-runner.js bridge ${scriptName}`;
  if (packageJson.scripts?.[scriptName] !== expectedCommand) {
    failures.push(`${scriptName}: shared Jenkins hook must remain a no-op bridge while Playwright stages own execution.`);
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

if (failures.length > 0) {
  console.error('Playwright architecture guard failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}
