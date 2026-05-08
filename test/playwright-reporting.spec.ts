import { strict as assert } from 'node:assert';
import {
  resolveDefaultReporter,
  resolveEnvironmentFromUrl,
  resolveReporters,
  resolveTagGrep,
  resolveTagGrepInvert,
  resolveWorkerCount,
} from '../playwright-reporting';

describe('playwright reporting configuration', () => {
  it('defaults to list locally and dot in CI', () => {
    assert.equal(resolveDefaultReporter({}), 'list');
    assert.equal(resolveDefaultReporter({ CI: 'true' }), 'dot');
    assert.equal(resolveDefaultReporter({ PLAYWRIGHT_DEFAULT_REPORTER: 'line' }), 'line');
  });

  it('parses configured worker count safely', () => {
    assert.equal(resolveWorkerCount({ FUNCTIONAL_TESTS_WORKERS: '4' }), 4);
    assert.equal(resolveWorkerCount({ FUNCTIONAL_TESTS_WORKERS: '0' }), 1);
    assert.equal(resolveWorkerCount({ FUNCTIONAL_TESTS_WORKERS: 'invalid' }), 1);
  });

  it('infers target environment from known service URLs', () => {
    assert.equal(resolveEnvironmentFromUrl('http://localhost:3000'), 'local');
    assert.equal(resolveEnvironmentFromUrl('https://manage-org.aat.platform.hmcts.net'), 'aat');
    assert.equal(resolveEnvironmentFromUrl('not-a-url'), 'unknown');
  });

  it('resolves explicit reporter ordering without duplicates', () => {
    const reporters = resolveReporters(
      {
        defaultIndexFilename: 'index.html',
        defaultProject: 'Manage Org',
        defaultRelease: '1.0.0',
        defaultTitle: 'Manage Org Playwright',
        includeJunit: true,
      },
      'https://manage-org.aat.platform.hmcts.net',
      {
        PLAYWRIGHT_REPORTERS: 'list,html,odhin,list,junit',
        PLAYWRIGHT_REPORT_BRANCH: 'test/exui-4354',
      },
    );

    assert.deepEqual(
      reporters.map((reporter) => reporter[0]),
      ['list', 'html', 'odhin-reports-playwright', 'junit'],
    );
  });

  it('builds include and exclude tag grep expressions', () => {
    const include = resolveTagGrep({ PLAYWRIGHT_TAGS: '@e2e,@registration' });
    const exclude = resolveTagGrepInvert({ PLAYWRIGHT_EXCLUDE_TAGS: '@e2e-smoke,@wip' });

    assert.ok(include?.test('journey @e2e'));
    assert.ok(include?.test('journey @registration'));
    assert.equal(include?.test('journey @e2e-smoke'), false);
    assert.equal(include?.test('journey @api'), false);
    assert.ok(exclude?.test('journey @e2e-smoke'));
    assert.ok(exclude?.test('journey @wip'));
    assert.equal(resolveTagGrep({}), undefined);
  });
});
