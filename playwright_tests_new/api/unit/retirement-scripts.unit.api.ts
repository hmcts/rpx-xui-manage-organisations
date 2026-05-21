import { expect, test } from '@playwright/test';
import path from 'node:path';

let a11yRunner: {
  buildRunPlan: (
    argv: string[],
    env: Record<string, string | undefined>
  ) => {
    functionalOutputRoot: string;
    runs: Array<{ args: string[]; env: Record<string, string | undefined>; label: string }>;
    testOutputRoot: string;
  };
  resolveSafeOutputRoot: (configuredPath: string, label: string) => string;
  runYarn: (
    label: string,
    args: string[],
    envOverrides: Record<string, string | undefined>,
    env: Record<string, string | undefined>,
    spawn: (command: string, args: string[], options: { env: Record<string, string | undefined> }) => { status: number }
  ) => number;
};

let retiredRunner: {
  resolveRetiredRunnerOutcome: (mode: string, command: string) => { bridge: boolean; exitCode: number; reason: string };
};

test.describe('Manage Org Playwright retirement scripts', { tag: '@svc-internal' }, () => {
  test.beforeAll(async () => {
    const a11yModule = await import('../../../scripts/run-playwright-a11y.js');
    a11yRunner = (a11yModule.default ?? a11yModule) as typeof a11yRunner;

    const retiredModule = await import('../../../scripts/retired-codecept-runner.js');
    retiredRunner = (retiredModule.default ?? retiredModule) as typeof retiredRunner;
  });

  test('only permits the explicit shared functional bridge commands', () => {
    expect(retiredRunner.resolveRetiredRunnerOutcome('bridge', 'test:functional')).toMatchObject({
      bridge: true,
      exitCode: 0
    });
    expect(retiredRunner.resolveRetiredRunnerOutcome('bridge', 'test:fullfunctional')).toMatchObject({
      bridge: true,
      exitCode: 0
    });
    expect(retiredRunner.resolveRetiredRunnerOutcome('bridge', 'test:api')).toMatchObject({
      bridge: false,
      exitCode: 1
    });
    expect(retiredRunner.resolveRetiredRunnerOutcome('fail', 'test:api')).toMatchObject({
      bridge: false,
      exitCode: 1
    });
  });

  test('keeps the a11y runner scoped to @a11y even when caller env tags exclude it', () => {
    const plan = a11yRunner.buildRunPlan(['--project=chromium'], {
      PLAYWRIGHT_EXCLUDE_TAGS: '@a11y',
      PLAYWRIGHT_TAGS: '@e2e'
    });

    expect(plan.runs).toHaveLength(4);
    expect(plan.runs.map((run) => run.args)).toEqual([
      ['test:playwrightE2E:list', '--grep', '@a11y', '--project=chromium'],
      ['test:playwrightE2E:raw', '--', '--grep', '@a11y', '--project=chromium'],
      ['test:playwright:integration:raw', '--', '--list', '--grep', '@a11y', '--project=chromium'],
      ['test:playwright:integration:raw', '--', '--grep', '@a11y', '--project=chromium']
    ]);
  });

  test('clears inherited tag env when spawning a11y runs', () => {
    let capturedEnv: Record<string, string | undefined> = {};

    const status = a11yRunner.runYarn(
      'dry run',
      ['--version'],
      {},
      {
        PLAYWRIGHT_EXCLUDE_TAGS: '@a11y',
        PLAYWRIGHT_TAGS: '@e2e'
      },
      (_command, _args, options) => {
        capturedEnv = options.env;
        return { status: 0 };
      }
    );

    expect(status).toBe(0);
    expect(capturedEnv.PLAYWRIGHT_EXCLUDE_TAGS).toBe('');
    expect(capturedEnv.PLAYWRIGHT_INCLUDE_A11Y).toBe('true');
    expect(capturedEnv.PLAYWRIGHT_TAGS).toBe('');
    expect(capturedEnv.PW_ODHIN_FORCE_EXIT_ON_COMPLETION).toBe('true');
  });

  test('rejects caller grep overrides that would widen a11y execution', () => {
    expect(() => a11yRunner.buildRunPlan(['--grep', '@registration'], {})).toThrow(/Do not pass --grep/);
    expect(() => a11yRunner.buildRunPlan(['--grep-invert=@a11y'], {})).toThrow(/Do not pass --grep-invert=/);
    expect(() => a11yRunner.buildRunPlan(['-g', '@e2e'], {})).toThrow(/Do not pass -g/);
  });

  test('refuses to clean output roots outside the runner-owned directories', () => {
    expect(() => a11yRunner.resolveSafeOutputRoot(path.resolve('.'), 'root')).toThrow(/refusing to recursively delete/);
    expect(() => a11yRunner.resolveSafeOutputRoot('/tmp/playwright-a11y', 'tmp')).toThrow(
      /must stay under functional-output\/tests\/playwright-a11y or test-results\/playwright-a11y/
    );
    expect(a11yRunner.resolveSafeOutputRoot('functional-output/tests/playwright-a11y/html-report', 'html')).toBe(
      'functional-output/tests/playwright-a11y/html-report'
    );
    expect(a11yRunner.resolveSafeOutputRoot('test-results/playwright-a11y/integration', 'test-results')).toBe(
      'test-results/playwright-a11y/integration'
    );
  });
});
