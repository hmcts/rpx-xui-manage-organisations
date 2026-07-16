import { expect, test } from '@playwright/test';
import path from 'node:path';

let a11yRunner: {
  buildRunPlan: (
    argv: string[],
    env: Record<string, string | undefined>
  ) => {
    functionalOutputRoot: string;
    runs: Array<{ args: string[]; env: Record<string, string | undefined>; label: string; reportOnly?: boolean }>;
    testOutputRoot: string;
  };
  resolveSafeOutputRoot: (configuredPath: string, label: string) => string;
  shouldKeepNonBlocking?: (
    run: { reportOnly?: boolean },
    env: Record<string, string | undefined>
  ) => boolean;
  runYarn: (
    label: string,
    args: string[],
    envOverrides: Record<string, string | undefined>,
    env: Record<string, string | undefined>,
    spawn: (command: string, args: string[], options: { env: Record<string, string | undefined> }) => { status: number }
  ) => number;
};

let waveA11yRunner: typeof a11yRunner;
let accessibilityRunner: typeof a11yRunner & {
  isStrictMode: (env: Record<string, string | undefined>) => boolean;
};

test.describe('Manage Org Playwright support scripts', { tag: '@svc-internal' }, () => {
  test.beforeAll(async () => {
    const a11yModule = await import('../../../scripts/run-playwright-a11y.js');
    const waveA11yModule = await import('../../../scripts/run-playwright-wave-a11y.js');
    const accessibilityModule = await import('../../../scripts/run-playwright-accessibility.js');
    a11yRunner = (a11yModule.default ?? a11yModule) as typeof a11yRunner;
    waveA11yRunner = (waveA11yModule.default ?? waveA11yModule) as typeof waveA11yRunner;
    accessibilityRunner = (accessibilityModule.default ?? accessibilityModule) as typeof accessibilityRunner;
  });

  test('keeps the a11y runner scoped to @a11y even when caller env tags exclude it', () => {
    const plan = a11yRunner.buildRunPlan(['--project=chromium'], {
      PLAYWRIGHT_EXCLUDE_TAGS: '@a11y',
      PLAYWRIGHT_TAGS: '@e2e'
    });

    expect(plan.runs).toHaveLength(2);
    expect(plan.runs.map((run) => run.args)).toEqual([
      ['test:playwrightE2E:list', '--grep', '@a11y', '--project=chromium'],
      ['test:playwrightE2E:raw', '--', '--grep', '@a11y', '--project=chromium']
    ]);
  });

  test('clears inherited tag env when spawning a11y runs', () => {
    let capturedEnv: Record<string, string | undefined> = {};

    const status = a11yRunner.runYarn(
      'dry run',
      ['--version'],
      {},
      {
        E2E_PW_EXCLUDED_TAGS_OVERRIDE: '@registration',
        E2E_PW_INCLUDE_TAGS: '@registration',
        PLAYWRIGHT_EXCLUDE_TAGS: '@a11y',
        PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@registration @e2e',
        PLAYWRIGHT_TAGS: '@e2e'
      },
      (_command, _args, options) => {
        capturedEnv = options.env;
        return { status: 0 };
      }
    );

    expect(status).toBe(0);
    expect(capturedEnv.E2E_PW_EXCLUDED_TAGS_OVERRIDE).toBe('');
    expect(capturedEnv.E2E_PW_INCLUDE_TAGS).toBe('');
    expect(capturedEnv.PLAYWRIGHT_EXCLUDE_TAGS).toBe('');
    expect(capturedEnv.PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS).toBe('@none');
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
    expect(a11yRunner.resolveSafeOutputRoot('test-results/playwright-a11y/chromium', 'test-results')).toBe(
      'test-results/playwright-a11y/chromium'
    );
  });

  test('keeps the WAVE-like runner scoped to @wave-a11y and separate output roots', () => {
    const plan = waveA11yRunner.buildRunPlan(['--project=chromium'], {
      PLAYWRIGHT_EXCLUDE_TAGS: '@a11y',
      PLAYWRIGHT_TAGS: '@e2e'
    });

    expect(plan.functionalOutputRoot).toBe('functional-output/tests/playwright-wave-a11y');
    expect(plan.testOutputRoot).toBe('test-results/playwright-wave-a11y');
    expect(plan.runs.map((run) => run.args)).toEqual([
      ['test:playwrightE2E:list', '--grep', '@wave-a11y', '--project=chromium'],
      [
        'test:playwrightE2E:raw',
        '--',
        '--grep',
        '@wave-a11y',
        '--project=chromium',
        '--retries=0'
      ]
    ]);
    expect(plan.runs[1].env.PLAYWRIGHT_JUNIT_OUTPUT).toBe(
      'functional-output/tests/playwright-wave-a11y/playwright-wave-a11y-junit.xml'
    );
    expect(plan.runs[1].env.PLAYWRIGHT_REPORT_INDEX_FILENAME).toBe('xui-playwright-wave-a11y.html');
    expect(plan.runs[1].env.PLAYWRIGHT_DISABLE_GENERIC_FAILURE_ARTIFACTS).toBe('true');
  });

  test('forces WAVE-like tag env when spawning WAVE-like runs', () => {
    const plan = waveA11yRunner.buildRunPlan([], {
      PLAYWRIGHT_EXCLUDE_TAGS: '@wave-a11y',
      PLAYWRIGHT_TAGS: '@e2e'
    });

    expect(plan.runs[0].env.PLAYWRIGHT_EXCLUDE_TAGS).toBe('');
    expect(plan.runs[0].env.PLAYWRIGHT_INCLUDE_A11Y).toBe('');
    expect(plan.runs[0].env.PLAYWRIGHT_INCLUDE_WAVE_A11Y).toBe('true');
    expect(plan.runs[0].env.PLAYWRIGHT_TAGS).toBe('@wave-a11y');
  });

  test('rejects caller grep overrides that would widen WAVE-like execution', () => {
    expect(() => waveA11yRunner.buildRunPlan(['--grep', '@registration'], {})).toThrow(/Do not pass --grep/);
    expect(() => waveA11yRunner.buildRunPlan(['--grep-invert=@wave-a11y'], {})).toThrow(
      /Do not pass --grep-invert=/
    );
    expect(() => waveA11yRunner.buildRunPlan(['-g', '@e2e'], {})).toThrow(/Do not pass -g/);
  });

  test('refuses to clean WAVE-like output roots outside the runner-owned directories', () => {
    expect(() => waveA11yRunner.resolveSafeOutputRoot(path.resolve('.'), 'root')).toThrow(
      /refusing to recursively delete/
    );
    expect(() => waveA11yRunner.resolveSafeOutputRoot('/tmp/playwright-wave-a11y', 'tmp')).toThrow(
      /must stay under functional-output\/tests\/playwright-wave-a11y or test-results\/playwright-wave-a11y/
    );
    expect(
      waveA11yRunner.resolveSafeOutputRoot('functional-output/tests/playwright-wave-a11y/html-report', 'html')
    ).toBe('functional-output/tests/playwright-wave-a11y/html-report');
    expect(waveA11yRunner.resolveSafeOutputRoot('test-results/playwright-wave-a11y/chromium', 'test-results')).toBe(
      'test-results/playwright-wave-a11y/chromium'
    );
  });

  test('keeps the unified accessibility runner scoped to axe and WAVE-like tags', () => {
    const plan = accessibilityRunner.buildRunPlan(['--project=chromium'], {
      PLAYWRIGHT_EXCLUDE_TAGS: '@a11y',
      PLAYWRIGHT_TAGS: '@e2e'
    });

    expect(plan.functionalOutputRoot).toBe('functional-output/tests/playwright-accessibility');
    expect(plan.testOutputRoot).toBe('test-results/playwright-accessibility');
    expect(plan.runs.map((run) => run.args)).toEqual([
      ['test:playwrightE2E:list', '--grep', '(?:@a11y|@wave-a11y)', '--project=chromium'],
      [
        'test:playwrightE2E:raw',
        '--',
        '--grep',
        '(?:@a11y|@wave-a11y)',
        '--project=chromium',
        '--retries=0'
      ]
    ]);
    expect(plan.runs[1].env.PLAYWRIGHT_JUNIT_OUTPUT).toBe(
      'functional-output/tests/playwright-accessibility/playwright-accessibility-junit.xml'
    );
    expect(plan.runs[1].env.PLAYWRIGHT_REPORT_INDEX_FILENAME).toBe('xui-playwright-accessibility.html');
    expect(plan.runs[1].env.PLAYWRIGHT_DISABLE_GENERIC_FAILURE_ARTIFACTS).toBe('true');
  });

  test('forces both accessibility engines when spawning unified accessibility runs', () => {
    let capturedEnv: Record<string, string | undefined> = {};

    const status = accessibilityRunner.runYarn(
      'dry run',
      ['--version'],
      {},
      {
        E2E_PW_EXCLUDED_TAGS_OVERRIDE: '@wave-a11y',
        E2E_PW_INCLUDE_TAGS: '@registration',
        PLAYWRIGHT_EXCLUDE_TAGS: '@wave-a11y',
        PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@registration @e2e',
        PLAYWRIGHT_TAGS: '@e2e',
        PW_ACCESSIBILITY_WORKERS: '15'
      },
      (_command, _args, options) => {
        capturedEnv = options.env;
        return { status: 0 };
      }
    );

    expect(status).toBe(0);
    expect(capturedEnv.E2E_PW_EXCLUDED_TAGS_OVERRIDE).toBe('');
    expect(capturedEnv.E2E_PW_INCLUDE_TAGS).toBe('');
    expect(capturedEnv.FUNCTIONAL_TESTS_WORKERS).toBe('15');
    expect(capturedEnv.PLAYWRIGHT_EXCLUDE_TAGS).toBe('');
    expect(capturedEnv.PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS).toBe('@none');
    expect(capturedEnv.PLAYWRIGHT_INCLUDE_A11Y).toBe('true');
    expect(capturedEnv.PLAYWRIGHT_INCLUDE_WAVE_A11Y).toBe('true');
    expect(capturedEnv.PLAYWRIGHT_TAGS).toBe('');
    expect(capturedEnv.PW_ODHIN_FORCE_EXIT_ON_COMPLETION).toBe('true');
  });

  test('keeps unified accessibility report-only unless strict mode is explicit', () => {
    expect(accessibilityRunner.isStrictMode({})).toBe(false);
    expect(accessibilityRunner.isStrictMode({ A11Y_STRICT: 'false' })).toBe(false);
    expect(accessibilityRunner.isStrictMode({ A11Y_STRICT: 'true' })).toBe(true);
  });

  test('does not mask unified accessibility discovery failures as report-only', () => {
    const plan = accessibilityRunner.buildRunPlan([], {});

    expect(accessibilityRunner.shouldKeepNonBlocking?.(plan.runs[0], {})).toBe(false);
    expect(accessibilityRunner.shouldKeepNonBlocking?.(plan.runs[1], {})).toBe(true);
    expect(accessibilityRunner.shouldKeepNonBlocking?.(plan.runs[1], { A11Y_STRICT: 'true' })).toBe(false);
  });

  test('rejects caller grep overrides that would widen unified accessibility execution', () => {
    expect(() => accessibilityRunner.buildRunPlan(['--grep', '@registration'], {})).toThrow(/Do not pass --grep/);
    expect(() => accessibilityRunner.buildRunPlan(['--grep-invert=@wave-a11y'], {})).toThrow(
      /Do not pass --grep-invert=/
    );
    expect(() => accessibilityRunner.buildRunPlan(['-g', '@e2e'], {})).toThrow(/Do not pass -g/);
  });

  test('refuses to clean unified accessibility output roots outside the runner-owned directories', () => {
    expect(() => accessibilityRunner.resolveSafeOutputRoot(path.resolve('.'), 'root')).toThrow(
      /refusing to recursively delete/
    );
    expect(() => accessibilityRunner.resolveSafeOutputRoot('/tmp/playwright-accessibility', 'tmp')).toThrow(
      /must stay under functional-output\/tests\/playwright-accessibility or test-results\/playwright-accessibility/
    );
    expect(
      accessibilityRunner.resolveSafeOutputRoot('functional-output/tests/playwright-accessibility/html-report', 'html')
    ).toBe('functional-output/tests/playwright-accessibility/html-report');
    expect(
      accessibilityRunner.resolveSafeOutputRoot('test-results/playwright-accessibility/chromium', 'test-results')
    ).toBe('test-results/playwright-accessibility/chromium');
  });
});
