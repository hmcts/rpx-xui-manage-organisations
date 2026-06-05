import type { ReporterDescription } from '@playwright/test';
import { execSync } from 'node:child_process';
import { availableParallelism, cpus, totalmem } from 'node:os';

type EnvMap = NodeJS.ProcessEnv;

const MAX_LOCAL_WORKERS = 10;

type ReporterOptions = {
  defaultIndexFilename: string;
  defaultOutputFolder?: string;
  defaultProject: string;
  defaultRelease: string;
  defaultTitle: string;
  htmlOutputFolder?: string;
  includeJunit?: boolean;
};

const resolveFlag = (raw: string | undefined, fallback: boolean): boolean => {
  if (raw === undefined || raw.trim() === '') {
    return fallback;
  }
  return raw.trim().toLowerCase() === 'true';
};

const resolvePositiveNumber = (raw: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(String(raw ?? ''), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const resolveOdhinTestOutput = (env: EnvMap = process.env): boolean | 'only-on-failure' => {
  const configured = (env.PW_ODHIN_TEST_OUTPUT ?? 'only-on-failure').trim().toLowerCase();
  if (configured === 'true') {
    return true;
  }
  if (configured === 'false') {
    return false;
  }
  return 'only-on-failure';
};

export const resolveDefaultReporter = (env: EnvMap = process.env): string => {
  const configured = env.PLAYWRIGHT_DEFAULT_REPORTER?.trim();
  return configured || (env.CI ? 'dot' : 'list');
};

type WorkerCountOptions = {
  localDefault?: number;
};

export const resolveWorkerCount = (env: EnvMap = process.env, options: WorkerCountOptions = {}): number => {
  const configured = env.FUNCTIONAL_TESTS_WORKERS?.trim();
  const parsed = configured ? Number.parseInt(configured, 10) : Number.NaN;
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  if (env.CI) {
    return 1;
  }
  const localDefault = options.localDefault ?? MAX_LOCAL_WORKERS;
  return Math.max(Math.min(availableParallelism?.() ?? cpus().length, localDefault), 1);
};

export const resolveOutputDir = (env: EnvMap = process.env): string =>
  env.PLAYWRIGHT_TEST_OUTPUT_DIR || env.PLAYWRIGHT_OUTPUT_DIR || 'test-results';

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const resolveTagPattern = (configured?: string): RegExp | undefined => {
  const tags = configured
    ?.split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return tags?.length ? new RegExp(`(^|[^\\w-])(?:${tags.map(escapeRegExp).join('|')})(?=$|[^\\w-])`) : undefined;
};

export const resolveTagGrep = (env: EnvMap = process.env): RegExp | undefined => resolveTagPattern(env.PLAYWRIGHT_TAGS);

export const resolveTagGrepInvert = (env: EnvMap = process.env): RegExp | undefined =>
  resolveTagPattern(env.PLAYWRIGHT_EXCLUDE_TAGS);

const resolveHtmlOutputFolder = (options: ReporterOptions, env: EnvMap = process.env): string =>
  env.PLAYWRIGHT_HTML_OUTPUT || options.htmlOutputFolder || 'functional-output/tests/playwright-e2e';

const resolveOdhinOutputFolder = (options: ReporterOptions, env: EnvMap = process.env): string =>
  env.PLAYWRIGHT_REPORT_FOLDER ||
  env.PW_ODHIN_OUTPUT ||
  options.defaultOutputFolder ||
  'functional-output/tests/playwright-e2e/odhin-report';

const resolveOdhinIndexFilename = (options: ReporterOptions, env: EnvMap = process.env): string =>
  env.PLAYWRIGHT_REPORT_INDEX_FILENAME || env.PW_ODHIN_INDEX || options.defaultIndexFilename;

export const resolveEnvironmentFromUrl = (baseUrl: string): string => {
  try {
    const hostname = new URL(baseUrl).hostname.toLowerCase();
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'local';
    }
    if (hostname.includes('.aat.')) {
      return 'aat';
    }
    if (hostname.includes('.ithc.')) {
      return 'ithc';
    }
    if (hostname.includes('.demo.')) {
      return 'demo';
    }
    if (hostname.includes('.perftest.')) {
      return 'perftest';
    }
    return hostname;
  } catch {
    return 'unknown';
  }
};

export const resolveBranchName = (env: EnvMap = process.env): string => {
  const envBranch =
    env.PLAYWRIGHT_REPORT_BRANCH ||
    env.GIT_BRANCH ||
    env.BRANCH_NAME ||
    env.GITHUB_REF_NAME ||
    env.GITHUB_HEAD_REF ||
    env.BUILD_SOURCEBRANCHNAME;
  if (envBranch) {
    return envBranch.replace(/^refs\/heads\//, '').trim();
  }
  try {
    const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .trim()
      .replace(/^refs\/heads\//, '');
    if (gitBranch && gitBranch !== 'HEAD') {
      return gitBranch;
    }
  } catch {
    // Fall back to a local label when branch resolution is unavailable.
  }
  return 'local';
};

const resolveTestEnvironmentLabel = (env: EnvMap, baseUrl: string, workerCount: number): string => {
  const configured = env.PLAYWRIGHT_REPORT_TEST_ENVIRONMENT || env.PW_ODHIN_ENV;
  if (configured) {
    return configured;
  }
  const targetEnv = env.TEST_TYPE ?? resolveEnvironmentFromUrl(baseUrl);
  const runContext = env.CI ? 'ci' : 'local-run';
  const cpuCores = cpus()?.length ?? 'unknown';
  const totalRamGiB = Math.round((totalmem() / 1024 ** 3) * 10) / 10;
  return `${targetEnv} | ${runContext} | workers=${workerCount} | agent_cpu_cores=${cpuCores} | agent_ram_gib=${totalRamGiB}`;
};

export const resolveReporters = (options: ReporterOptions, baseUrl: string, env: EnvMap = process.env): ReporterDescription[] => {
  const configured = env.PLAYWRIGHT_REPORTERS?.split(',')
    .map((reporter) => reporter.trim())
    .filter(Boolean);
  const reporterNames = configured?.length
    ? configured
    : [resolveDefaultReporter(env), 'html', 'odhin-progress', 'odhin', ...(options.includeJunit && env.CI ? ['junit'] : [])];
  const uniqueReporterNames = reporterNames.filter((reporterName, index) => reporterNames.indexOf(reporterName) === index);
  const workerCount = resolveWorkerCount(env);
  const reportBranch = resolveBranchName(env);

  return uniqueReporterNames.map((reporterName) => {
    switch (reporterName.toLowerCase()) {
      case 'html':
        return [
          'html',
          {
            open: env.PLAYWRIGHT_HTML_OPEN || 'never',
            outputFolder: resolveHtmlOutputFolder(options, env),
          },
        ];
      case 'junit':
        return ['junit', { outputFile: env.PLAYWRIGHT_JUNIT_OUTPUT || 'playwright-junit.xml' }];
      case 'odhin':
        return [
          './playwright_tests_new/common/reporters/odhin-adaptive.reporter.cjs',
          {
            outputFolder: resolveOdhinOutputFolder(options, env),
            indexFilename: resolveOdhinIndexFilename(options, env),
            title: env.PLAYWRIGHT_REPORT_TITLE || env.PW_ODHIN_TITLE || options.defaultTitle,
            testEnvironment: resolveTestEnvironmentLabel(env, baseUrl, workerCount),
            project: env.PLAYWRIGHT_REPORT_PROJECT || env.PW_ODHIN_PROJECT || options.defaultProject,
            release:
              env.PLAYWRIGHT_REPORT_RELEASE || env.PW_ODHIN_RELEASE || `${options.defaultRelease} | branch=${reportBranch}`,
            startServer: env.PW_ODHIN_START_SERVER === 'true',
            consoleLog: resolveFlag(env.PW_ODHIN_CONSOLE_LOG, Boolean(env.CI)),
            consoleError: resolveFlag(env.PW_ODHIN_CONSOLE_ERROR, Boolean(env.CI)),
            testOutput: resolveOdhinTestOutput(env),
            lightweight: resolveFlag(env.PW_ODHIN_LIGHTWEIGHT, !env.CI),
            profile: resolveFlag(env.PW_ODHIN_PROFILE, true),
            runtimeHookTimeoutMs: resolvePositiveNumber(env.PW_ODHIN_RUNTIME_HOOK_TIMEOUT_MS, env.CI ? 0 : 15000),
          },
        ];
      case 'odhin-progress':
        return [
          './playwright_tests_new/common/reporters/odhin-progress.reporter.cjs',
          {
            enabled: resolveFlag(env.PW_ODHIN_PROGRESS, Boolean(env.CI)),
            graceMs: resolvePositiveNumber(env.PW_ODHIN_PROGRESS_GRACE_MS, 1500),
            intervalMs: resolvePositiveNumber(env.PW_ODHIN_PROGRESS_INTERVAL_MS, 5000),
            hardTimeoutMs: resolvePositiveNumber(env.PW_ODHIN_PROGRESS_HARD_TIMEOUT_MS, 0),
            timeoutExitCode: resolvePositiveNumber(env.PW_ODHIN_PROGRESS_TIMEOUT_EXIT_CODE, 1),
            completionExitDelayMs: resolvePositiveNumber(env.PW_ODHIN_COMPLETION_EXIT_DELAY_MS, 0),
            forceExitOnCompletion: resolveFlag(env.PW_ODHIN_FORCE_EXIT_ON_COMPLETION, Boolean(env.CI)),
          },
        ];
      case 'dot':
        return ['dot'];
      case 'line':
        return ['line'];
      case 'list':
        return ['list'];
      default:
        return [reporterName];
    }
  });
};
