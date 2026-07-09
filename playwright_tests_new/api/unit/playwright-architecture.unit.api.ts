import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import {
  cnpCompatibilityScripts,
  createArchitectureGuardFixture,
  forbiddenPackageScripts,
  runArchitectureGuard,
  updateJsonFile
} from '../utils/architecture-guard-fixture';

type FixtureMutation = (rootDir: string) => void;

const expectGuardFailure = (mutation: FixtureMutation, expectedFailure: RegExp): void => {
  const rootDir = createArchitectureGuardFixture();

  try {
    mutation(rootDir);
    const result = runArchitectureGuard(rootDir);

    expect(result.status).toBe(1);
    expect(`${result.stdout}\n${result.stderr}`).toMatch(expectedFailure);
  } finally {
    fs.rmSync(rootDir, { force: true, recursive: true });
  }
};

test.describe('Manage Org Playwright architecture guard', { tag: '@svc-internal' }, () => {
  test('passes for the minimal active Playwright retirement contract', () => {
    const rootDir = createArchitectureGuardFixture();

    try {
      const result = runArchitectureGuard(rootDir);

      expect(result.status).toBe(0);
      expect(result.stderr).toBe('');
    } finally {
      fs.rmSync(rootDir, { force: true, recursive: true });
    }
  });

  test('rejects retired framework directories', () => {
    expectGuardFailure((rootDir) => {
      fs.mkdirSync(path.join(rootDir, 'test_codecept'), { recursive: true });
    }, /test_codecept: retired legacy test assets must stay deleted/);
  });

  test('rejects retired framework dependencies', () => {
    expectGuardFailure((rootDir) => {
      updateJsonFile(path.join(rootDir, 'package.json'), (packageJson) => ({
        ...packageJson,
        devDependencies: {
          codeceptjs: '3.0.0'
        }
      }));
    }, /devDependencies\.codeceptjs: retired legacy test dependency must not be reintroduced/);
  });

  test('rejects retired package script aliases', () => {
    for (const scriptName of forbiddenPackageScripts) {
      expectGuardFailure((rootDir) => {
        updateJsonFile(path.join(rootDir, 'package.json'), (packageJson) => {
          const scripts = packageJson.scripts as Record<string, string>;
          return {
            ...packageJson,
            scripts: {
              ...scripts,
              [scriptName]: 'echo legacy test command'
            }
          };
        });
      }, new RegExp(`${scriptName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}: retired package script must stay removed`));
    }
  });

  test('rejects skipped API tests', () => {
    expectGuardFailure((rootDir) => {
      fs.writeFileSync(
        path.join(rootDir, 'playwright_tests_new/api/skipped-contract.api.ts'),
        'import { test } from \'./fixtures\';\ntest.skip(\'does not run\', async () => {});\n'
      );
    }, /playwright_tests_new\/api\/skipped-contract\.api\.ts: API tests must not be skipped/);
  });

  test('rejects CNP compatibility hooks that are not inert', () => {
    for (const scriptName of Object.keys(cnpCompatibilityScripts)) {
      expectGuardFailure((rootDir) => {
        updateJsonFile(path.join(rootDir, 'package.json'), (packageJson) => {
          const scripts = packageJson.scripts as Record<string, string>;
          return {
            ...packageJson,
            scripts: {
              ...scripts,
              [scriptName]: 'echo legacy test command'
            }
          };
        });
      }, new RegExp(`${scriptName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}: CNP compatibility hook must remain a no-op`));
    }
  });

  test('rejects the retired compatibility runner', () => {
    expectGuardFailure((rootDir) => {
      fs.writeFileSync(path.join(rootDir, 'scripts/retired-codecept-runner.js'), 'process.exit(0);\n');
    }, /scripts\/retired-codecept-runner\.js: retired compatibility runner must stay deleted/);
  });

  test('rejects active configs that point at the retired Playwright tree', () => {
    expectGuardFailure((rootDir) => {
      fs.writeFileSync(path.join(rootDir, 'playwright.config.ts'), 'export default { testDir: \'./playwright_tests\' };\n');
    }, /playwright\.config\.ts: active Playwright configs must select playwright_tests_new\/\*\*/);
  });

  test('rejects Jenkins legacy commands', () => {
    expectGuardFailure((rootDir) => {
      fs.writeFileSync(path.join(rootDir, 'Jenkinsfile_CNP'), 'sh \'yarn test:codeceptE2E\'\n');
    }, /Jenkinsfile_CNP: contains legacy yarn test command/);
  });

  test('rejects optional JUnit publication for required Playwright evidence', () => {
    expectGuardFailure((rootDir) => {
      fs.writeFileSync(
        path.join(rootDir, 'Jenkinsfile_CNP'),
        'steps.junit(allowEmptyResults: true, testResults: \'functional-output/tests/playwright-api/**/*junit.xml\')\n'
      );
    }, /Jenkinsfile_CNP: contains optional JUnit publisher for required Playwright evidence/);
  });

  test('rejects missing required Jenkins JUnit lane publication', () => {
    expectGuardFailure((rootDir) => {
      const pipelinePath = path.join(rootDir, 'Jenkinsfile_CNP');
      fs.writeFileSync(
        pipelinePath,
        fs
          .readFileSync(pipelinePath, 'utf8')
          .replace('publishPlaywrightJUnit(\'functional-output/tests/playwright-e2e/**/*junit.xml\')', '')
      );
    }, /Jenkinsfile_CNP: missing required Playwright JUnit evidence contract E2E JUnit publication/);
  });

  test('rejects nightly accessibility failures published as Jenkins test results', () => {
    expectGuardFailure((rootDir) => {
      const pipelinePath = path.join(rootDir, 'Jenkinsfile_nightly');
      fs.writeFileSync(
        pipelinePath,
        `${fs.readFileSync(pipelinePath, 'utf8')}\npublishPlaywrightJUnit('${'${playwrightAccessibilityOutputRoot}'}/**/*junit.xml')\n`
      );
    }, /Jenkinsfile_nightly: contains forbidden Playwright pipeline behavior contract nightly accessibility JUnit publisher/);
  });

  test('rejects nightly accessibility evidence that is not archived', () => {
    expectGuardFailure((rootDir) => {
      const pipelinePath = path.join(rootDir, 'Jenkinsfile_nightly');
      fs.writeFileSync(
        pipelinePath,
        fs.readFileSync(pipelinePath, 'utf8').replace('JUnit XML is archived only', 'JUnit XML is published')
      );
    }, /Jenkinsfile_nightly: missing required Playwright pipeline behavior contract nightly accessibility JUnit archive-only evidence/);
  });

  test('rejects nightly accessibility Odhín publishing being removed', () => {
    expectGuardFailure((rootDir) => {
      const pipelinePath = path.join(rootDir, 'Jenkinsfile_nightly');
      fs.writeFileSync(
        pipelinePath,
        fs.readFileSync(pipelinePath, 'utf8').replace('xui-playwright-accessibility.html', 'missing-accessibility.html')
      );
    }, /Jenkinsfile_nightly: missing required Playwright pipeline behavior contract nightly accessibility Odhín HTML publication/);
  });

  test('rejects missing parameterized shared JUnit publisher', () => {
    expectGuardFailure((rootDir) => {
      const pipelinePath = path.join(rootDir, 'Jenkinsfile_parameterized');
      fs.writeFileSync(
        pipelinePath,
        fs
          .readFileSync(pipelinePath, 'utf8')
          .replace('junit(allowEmptyResults: false, testResults: artifacts.replace(\'**\', \'**/*junit.xml\'))', '')
      );
    }, /Jenkinsfile_parameterized: missing required Playwright JUnit evidence contract shared lane JUnit publisher/);
  });

  test('rejects a missing parameterized evidence contract', () => {
    expectGuardFailure((rootDir) => {
      const pipelinePath = path.join(rootDir, 'Jenkinsfile_parameterized');
      fs.writeFileSync(
        pipelinePath,
        fs.readFileSync(pipelinePath, 'utf8').replaceAll('xui-playwright-accessibility.html', '')
      );
    }, /Jenkinsfile_parameterized: missing Playwright retirement evidence contract xui-playwright-accessibility\.html/);
  });
});
