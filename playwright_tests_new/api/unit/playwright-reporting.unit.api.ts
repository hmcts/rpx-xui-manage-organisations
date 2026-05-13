import { expect, test } from '@playwright/test';
import {
  resolveDefaultReporter,
  resolveEnvironmentFromUrl,
  resolveReporters,
  resolveTagGrep,
  resolveTagGrepInvert,
  resolveWorkerCount
} from '../../../playwright-reporting';

test.describe('playwright reporting configuration', () => {
  test('defaults to list locally and dot in CI', () => {
    expect(resolveDefaultReporter({})).toBe('list');
    expect(resolveDefaultReporter({ CI: 'true' })).toBe('dot');
    expect(resolveDefaultReporter({ PLAYWRIGHT_DEFAULT_REPORTER: 'line' })).toBe('line');
  });

  test('parses configured worker count safely', () => {
    expect(resolveWorkerCount({ FUNCTIONAL_TESTS_WORKERS: '4' })).toBe(4);
    expect(resolveWorkerCount({ FUNCTIONAL_TESTS_WORKERS: '0' })).toBe(1);
    expect(resolveWorkerCount({ FUNCTIONAL_TESTS_WORKERS: 'invalid' })).toBe(1);
  });

  test('infers target environment from known service URLs', () => {
    expect(resolveEnvironmentFromUrl('http://localhost:3000')).toBe('local');
    expect(resolveEnvironmentFromUrl('https://manage-org.aat.platform.hmcts.net')).toBe('aat');
    expect(resolveEnvironmentFromUrl('not-a-url')).toBe('unknown');
  });

  test('resolves explicit reporter ordering without duplicates', () => {
    const reporters = resolveReporters(
      {
        defaultIndexFilename: 'index.html',
        defaultProject: 'Manage Org',
        defaultRelease: '1.0.0',
        defaultTitle: 'Manage Org Playwright',
        includeJunit: true
      },
      'https://manage-org.aat.platform.hmcts.net',
      {
        PLAYWRIGHT_REPORTERS: 'list,html,odhin,list,junit',
        PLAYWRIGHT_REPORT_BRANCH: 'test/exui-4354'
      }
    );

    expect(reporters.map((reporter) => reporter[0])).toEqual([
      'list',
      'html',
      './playwright_tests_new/common/reporters/odhin-adaptive.reporter.cjs',
      'junit'
    ]);
  });

  test('builds include and exclude tag grep expressions', () => {
    const include = resolveTagGrep({ PLAYWRIGHT_TAGS: '@e2e,@registration' });
    const exclude = resolveTagGrepInvert({ PLAYWRIGHT_EXCLUDE_TAGS: '@e2e-smoke,@wip' });

    expect(include?.test('journey @e2e')).toBe(true);
    expect(include?.test('journey @registration')).toBe(true);
    expect(include?.test('journey @e2e-smoke')).toBe(false);
    expect(include?.test('journey @api')).toBe(false);
    expect(exclude?.test('journey @e2e-smoke')).toBe(true);
    expect(exclude?.test('journey @wip')).toBe(true);
    expect(resolveTagGrep({})).toBeUndefined();
  });
});
