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
});
