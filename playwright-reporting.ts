import type { ReporterDescription } from '@playwright/test';
import { execSync } from 'node:child_process';
import { cpus, totalmem } from 'node:os';

type EnvMap = NodeJS.ProcessEnv;

type ReporterOptions = {
  defaultIndexFilename: string;
  defaultOutputFolder?: string;
  defaultProject: string;
  defaultRelease: string;
  defaultTitle: string;
  htmlOutputFolder?: string;
  includeJunit?: boolean;
};

export const resolveDefaultReporter = (env: EnvMap = process.env): string => {
  const configured = env.PLAYWRIGHT_DEFAULT_REPORTER?.trim();
  return configured || (env.CI ? 'dot' : 'list');
};

export const resolveWorkerCount = (env: EnvMap = process.env): number => {
  const configured = env.FUNCTIONAL_TESTS_WORKERS?.trim();
  const parsed = configured ? Number.parseInt(configured, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

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

const resolveTestEnvironmentLabel = (
  env: EnvMap,
  baseUrl: string,
  workerCount: number,
): string => {
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

export const resolveReporters = (
  options: ReporterOptions,
  baseUrl: string,
  env: EnvMap = process.env,
): ReporterDescription[] => {
  const configured = env.PLAYWRIGHT_REPORTERS
    ?.split(',')
    .map((reporter) => reporter.trim())
    .filter(Boolean);
  const reporterNames = configured?.length
    ? configured
    : [
        resolveDefaultReporter(env),
        'html',
        'odhin',
        ...(options.includeJunit && env.CI ? ['junit'] : []),
      ];
  const uniqueReporterNames = reporterNames.filter(
    (reporterName, index) => reporterNames.indexOf(reporterName) === index,
  );
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
          'odhin-reports-playwright',
          {
            outputFolder: resolveOdhinOutputFolder(options, env),
            indexFilename: resolveOdhinIndexFilename(options, env),
            title: env.PLAYWRIGHT_REPORT_TITLE || env.PW_ODHIN_TITLE || options.defaultTitle,
            testEnvironment: resolveTestEnvironmentLabel(env, baseUrl, workerCount),
            project: env.PLAYWRIGHT_REPORT_PROJECT || env.PW_ODHIN_PROJECT || options.defaultProject,
            release:
              env.PLAYWRIGHT_REPORT_RELEASE ||
              env.PW_ODHIN_RELEASE ||
              `${options.defaultRelease} | branch=${reportBranch}`,
            startServer: env.PW_ODHIN_START_SERVER === 'true',
            consoleLog: true,
            consoleError: true,
            testOutput: env.PW_ODHIN_TEST_OUTPUT || 'only-on-failure',
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
