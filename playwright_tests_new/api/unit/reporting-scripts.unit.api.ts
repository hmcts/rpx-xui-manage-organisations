import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

let ensureOdhinReport: {
  ensureOdhinReport: (options: { reportDir: string; reportFile?: string; suiteName?: string }) => {
    created: boolean;
    reportPath: string;
  };
  parseArgs: (argv: string[]) => { reportDir: string; reportFile: string; suiteName: string };
};

let ensureLoadProfileReport: {
  ensureLoadProfileReport: (options: { reportDir: string; reportFile?: string; reportName?: string }) => {
    created: boolean;
    reportPath: string;
  };
  parseArgs: (argv: string[]) => { reportDir: string; reportFile: string; reportName: string };
};

let loadMonitor: {
  buildPressureSignals: (samples: unknown[]) => {
    cpuSaturated: boolean;
    loadSaturated: boolean;
    memoryPressure: boolean;
    cpuSaturatedSamplePercent: number;
    memoryPressureThresholdPercent: number;
  };
  buildRecommendation: (signals: { cpuSaturated: boolean; loadSaturated: boolean; memoryPressure: boolean }) => string;
  parseArgs: (argv: string[]) => {
    options: {
      label: string;
      outputFolder: string;
      reportFolder: string;
      sampleIntervalMs: number;
    };
    commandArgs: string[];
  };
};

let evidenceDashboard: {
  buildPlaywrightEvidenceDashboard: (options: {
    apiPackageJsonPath?: string;
    outputDir?: string;
    packageJsonPath?: string;
    rootDir: string;
    title?: string;
  }) => {
    dashboardPath: string;
    model: {
      lanes: Array<{ id: string; status: string }>;
    };
  };
  parseArgs: (argv: string[]) => {
    apiPackageJsonPath: string;
    outputDir: string;
    packageJsonPath: string;
    rootDir: string;
    title: string;
  };
};

const sample = (overrides: Record<string, unknown>): Record<string, unknown> => ({
  cpuPercent: 10,
  load1PerCore: 0.2,
  memoryPressureThresholdPercent: 85,
  memoryUsedPercent: 40,
  ...overrides
});

test.describe('Manage Org Playwright reporting scripts', { tag: '@svc-internal' }, () => {
  test.beforeAll(async () => {
    const odhinModule = await import('../../../scripts/ensure-odhin-report.js');
    ensureOdhinReport = (odhinModule.default ?? odhinModule) as typeof ensureOdhinReport;

    const loadProfileModule = await import('../../../scripts/ensure-load-profile-report.js');
    ensureLoadProfileReport = (loadProfileModule.default ?? loadProfileModule) as typeof ensureLoadProfileReport;

    const loadMonitorModule = await import('../../../scripts/playwright-load-monitor.js');
    loadMonitor = (loadMonitorModule.default ?? loadMonitorModule) as typeof loadMonitor;

    const evidenceDashboardModule = await import('../../../scripts/build-playwright-evidence-dashboard.js');
    evidenceDashboard = (evidenceDashboardModule.default ?? evidenceDashboardModule) as typeof evidenceDashboard;
  });

  test('preserves an existing Odhín report and parses Jenkins arguments', () => {
    const reportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-existing-odhin-'));
    const reportPath = path.join(reportDir, 'xui-mo-playwright-api.html');
    fs.writeFileSync(reportPath, '<html><body>real report</body></html>');

    try {
      expect(
        ensureOdhinReport.ensureOdhinReport({
          reportDir,
          reportFile: 'xui-mo-playwright-api.html',
          suiteName: 'API'
        })
      ).toEqual({ created: false, reportPath });

      expect(
        ensureOdhinReport.parseArgs([
          '--report-dir',
          'functional-output/tests/playwright-api/odhin-report',
          '--report-file',
          'xui-mo-playwright-api.html',
          '--suite-name',
          'AAT Playwright API Test'
        ])
      ).toEqual({
        reportDir: 'functional-output/tests/playwright-api/odhin-report',
        reportFile: 'xui-mo-playwright-api.html',
        suiteName: 'AAT Playwright API Test'
      });
    } finally {
      fs.rmSync(reportDir, { recursive: true, force: true });
    }
  });

  test('creates a fallback Odhín report when the reporter did not write HTML', () => {
    const reportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-missing-odhin-'));

    try {
      const result = ensureOdhinReport.ensureOdhinReport({
        reportDir,
        reportFile: 'xui-mo-playwright-api.html',
        suiteName: 'Manage Org API'
      });

      expect(result.created).toBe(true);
      const html = fs.readFileSync(result.reportPath, 'utf8');
      expect(html).toContain('Manage Org API');
      expect(html).toContain('Odhín HTML report was not generated before Jenkins publishing.');
      expect(html).toContain('xui-mo-playwright-api.html');
    } finally {
      fs.rmSync(reportDir, { recursive: true, force: true });
    }
  });

  test('creates a fallback load-profile report and includes monitor diagnostics', () => {
    const reportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-load-profile-'));
    fs.writeFileSync(path.join(reportDir, 'monitor.log'), '[load-profile] interrupted before flush');

    try {
      const result = ensureLoadProfileReport.ensureLoadProfileReport({
        reportDir,
        reportFile: 'load-profile.html',
        reportName: 'PREVIEW Playwright API System Load'
      });

      expect(result.created).toBe(true);
      const html = fs.readFileSync(result.reportPath, 'utf8');
      expect(html).toContain('PREVIEW Playwright API System Load');
      expect(html).toContain('System load profile was not generated before Jenkins publishing.');
      expect(html).toContain('[load-profile] interrupted before flush');
    } finally {
      fs.rmSync(reportDir, { recursive: true, force: true });
    }
  });

  test('keeps load monitor wrapper arguments separate from the Playwright command', () => {
    const parsed = loadMonitor.parseArgs([
      '--sample-interval-ms',
      '1000',
      '--report-folder',
      'functional-output/tests/playwright-api/odhin-report',
      '--output-folder',
      'functional-output/tests/playwright-api/odhin-report/load-profile',
      '--label',
      'API',
      '--',
      'yarn',
      'test:api:pw:raw',
      '--workers=4'
    ]);

    expect(parsed.options).toMatchObject({
      label: 'API',
      outputFolder: 'functional-output/tests/playwright-api/odhin-report/load-profile',
      reportFolder: 'functional-output/tests/playwright-api/odhin-report',
      sampleIntervalMs: 1000
    });
    expect(parsed.commandArgs).toEqual(['yarn', 'test:api:pw:raw', '--workers=4']);
  });

  test('reports CPU and memory pressure from sampled Jenkins load', () => {
    const signals = loadMonitor.buildPressureSignals([
      sample({ cpuPercent: 91, load1PerCore: 1.7, memoryUsedPercent: 90 }),
      sample({ cpuPercent: 92, load1PerCore: 1.8, memoryUsedPercent: 91 }),
      sample({ cpuPercent: 20, load1PerCore: 0.3, memoryUsedPercent: 40 })
    ]);

    expect(signals.cpuSaturated).toBe(true);
    expect(signals.loadSaturated).toBe(true);
    expect(signals.memoryPressure).toBe(true);
    expect(signals.cpuSaturatedSamplePercent).toBe(66.67);
    expect(signals.memoryPressureThresholdPercent).toBe(85);
    expect(loadMonitor.buildRecommendation(signals)).toContain('Memory pressure detected');
  });

  test('builds a Manage Org evidence dashboard from lane artifacts', () => {
    const previousBuildUrl = process.env.BUILD_URL;
    const previousTestUrl = process.env.TEST_URL;
    const previousCwd = process.cwd();
    const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-evidence-workspace-'));
    const rootDir = path.join('functional-output', 'tests');
    const packageJsonPath = path.join(rootDir, 'package.json');
    const apiPackageJsonPath = path.join(rootDir, 'api-package.json');
    const outputDir = path.join(rootDir, 'manage-org-evidence');

    try {
      process.chdir(workspaceRoot);
      process.env.BUILD_URL = 'https://build.example.test/job/manage-org/job/PR-1568/6/?crumb=secret';
      process.env.TEST_URL = 'https://user:password@manage-org.example.test/path?token=secret#fragment';

      fs.mkdirSync(path.join(rootDir, 'playwright-api/odhin-report'), { recursive: true });
      fs.mkdirSync(path.join(rootDir, 'playwright-api/html-report'), { recursive: true });
      fs.mkdirSync(path.join('reports/tests/coverage/node'), { recursive: true });
      fs.mkdirSync(path.join('reports/tests/coverage/ng/html-report'), { recursive: true });
      fs.writeFileSync(path.join(rootDir, 'playwright-api/odhin-report/xui-mo-playwright-api.html'), '<html>api</html>');
      fs.writeFileSync(path.join(rootDir, 'playwright-api/html-report/index.html'), '<html>api html</html>');
      fs.writeFileSync(path.join(rootDir, 'playwright-api/playwright-api-junit.xml'), '<testsuite />');
      fs.writeFileSync(path.join('reports/tests/coverage/node/index.html'), '<html>node coverage</html>');
      fs.writeFileSync(path.join('reports/tests/coverage/ng/html-report/index.html'), '<html>ng coverage</html>');
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify({
          scripts: {
            'lint:reporting:scripts': 'node --check scripts/retired-codecept-runner.js',
            'test:coverage': 'yarn test:ng',
            'test:coverage:ng': 'ng test rpx-xui-manage-organisations --code-coverage --watch',
            'test:coverage:node': 'cd api && yarn coverage',
            'test:api:pw': 'playwright api',
            'test:codeceptE2E': 'node scripts/retired-codecept-runner.js fail test:codeceptE2E',
            'test:playwrightE2E': 'playwright e2e',
            'test:smoke': 'playwright smoke'
          }
        })
      );
      fs.writeFileSync(
        apiPackageJsonPath,
        JSON.stringify({
          nyc: {
            branches: 75,
            'check-coverage': true,
            functions: 77,
            lines: 86,
            'per-file': false,
            statements: 85
          }
        })
      );

      const result = evidenceDashboard.buildPlaywrightEvidenceDashboard({
        apiPackageJsonPath,
        outputDir,
        packageJsonPath,
        rootDir,
        title: 'PREVIEW Manage Org Evidence'
      });

      const apiLane = result.model.lanes.find((lane) => lane.id === 'api');
      const e2eLane = result.model.lanes.find((lane) => lane.id === 'e2e');
      const html = fs.readFileSync(result.dashboardPath, 'utf8');

      expect(apiLane?.status).toBe('ready');
      expect(e2eLane?.status).toBe('missing');
      expect(html).toContain('PREVIEW Manage Org Evidence');
      expect(html).toContain(
        'https://build.example.test/job/manage-org/job/PR-1568/6/artifact/functional-output/tests/playwright-api/odhin-report/xui-mo-playwright-api.html'
      );
      expect(html).not.toContain('../playwright-api/');
      expect(html).toContain('https://manage-org.example.test/path');
      expect(html).not.toContain('user:password');
      expect(html).not.toContain('token=secret');
      expect(html).not.toContain('crumb=secret');
      expect(html).toContain('test:codeceptE2E');
      expect(html).not.toContain('lint:reporting:scripts');
      expect(html).toContain('Coverage Position');
      expect(html).toContain('test:coverage:node');
      expect(html).toContain('Node coverage gate');
      expect(html).toContain('Aggregate');
      expect(html).toContain('85%');
      expect(html).toContain(
        'https://build.example.test/job/manage-org/job/PR-1568/6/artifact/reports/tests/coverage/node/index.html'
      );
      expect(html).toContain('Playwright is the authoritative Manage Organisation functional gate');
      expect(
        evidenceDashboard.parseArgs(['--root-dir', rootDir, '--title', 'Evidence', '--api-package-json', 'api/package.json'])
      ).toMatchObject({
        apiPackageJsonPath: 'api/package.json',
        title: 'Evidence'
      });
    } finally {
      process.chdir(previousCwd);
      if (previousBuildUrl === undefined) {
        delete process.env.BUILD_URL;
      } else {
        process.env.BUILD_URL = previousBuildUrl;
      }
      if (previousTestUrl === undefined) {
        delete process.env.TEST_URL;
      } else {
        process.env.TEST_URL = previousTestUrl;
      }
      fs.rmSync(workspaceRoot, { recursive: true, force: true });
    }
  });
});
