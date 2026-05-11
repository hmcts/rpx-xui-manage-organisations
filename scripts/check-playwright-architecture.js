const { existsSync, readdirSync, readFileSync, statSync } = require('node:fs');
const { join, relative, sep } = require('node:path');

const root = process.cwd();
const playwrightRoot = join(root, 'playwright_tests_new');
const allowedAssertionFiles = [
  /^playwright_tests_new\/E2E\/test\/.*\.(spec|test)\.ts$/,
  /^playwright_tests_new\/api\/[^/]+\.api\.ts$/,
  /^playwright_tests_new\/integration\/test\/.*\.spec\.ts$/
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

if (failures.length > 0) {
  console.error('Playwright architecture guard failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}
