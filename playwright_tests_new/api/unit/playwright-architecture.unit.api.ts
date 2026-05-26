import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import {
  createArchitectureGuardFixture,
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

  test('rejects retired package script aliases that stop failing fast', () => {
    expectGuardFailure((rootDir) => {
      updateJsonFile(path.join(rootDir, 'package.json'), (packageJson) => {
        const scripts = packageJson.scripts as Record<string, string>;
        return {
          ...packageJson,
          scripts: {
            ...scripts,
            'test:api': 'echo legacy API tests'
          }
        };
      });
    }, /test:api: legacy command must fail fast through scripts\/retired-codecept-runner\.js/);
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
        fs.readFileSync(pipelinePath, 'utf8').replace('xui-playwright-a11y-integration.html', '')
      );
    }, /Jenkinsfile_parameterized: missing Playwright retirement evidence contract xui-playwright-a11y-integration\.html/);
  });
});
