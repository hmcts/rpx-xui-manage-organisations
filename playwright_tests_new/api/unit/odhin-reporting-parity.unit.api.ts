import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { parse } from 'node-html-parser';

const require = createRequire(__filename);
const enhancer = require('../../common/reporters/odhin-report-enhancer.cjs');
const OdhinAdaptiveReporter = require('../../common/reporters/odhin-adaptive.reporter.cjs');
const baseHtml = '<html><head></head><body><div class="tab"><button class="main-tablinks">Tests</button></div><div class="dashboard-block"><div class="info-box-header">Files Summary</div></div></body></html>';

test.describe('Manage Org Odhín reporting parity', { tag: '@svc-internal' }, () => {
  test('ports modern presentation and connects feature metadata without changing native totals', () => {
    const native = `<html><head><meta name="viewport" content="initial-scale=1"></head><body id="body-content">
      <div class="tab"><button class="main-tablinks" onclick="openMainTab(event, 'TabTests')">Tests</button></div>
      <section id="TabDashboard"><div class="container-fluid"><div class="row">
        <div class="col-12 col-xl-6"><div class="dashboard-block"><div class="info-box-header">Run info</div></div></div>
        <div class="col-12 col-xl-6"><div class="dashboard-block"><div class="info-box-header">Global Summary</div><span class="chart-status-passed-info">1</span></div></div>
        <div class="col-12 col-xl-6"><div class="dashboard-block"><div class="info-box-header">Files Summary</div></div></div>
        <div class="col-12 col-xl-6"><div class="dashboard-block"><div class="info-box-header">Projects Summary</div></div></div>
      </div></div></section>
      <section id="TabTests"><table id="test-list-table"><thead><tr><th>Title</th><th>Status</th><th>Duration</th></tr></thead>
        <tbody><tr data-bs-target="#test-0"><td>creates organisation</td><td>passed</td><td>10 ms</td></tr></tbody>
        <tfoot><tr><th>Title</th><th>Status</th><th>Duration</th></tr></tfoot></table></section>
      </body></html>`;
    const html = enhancer.enhanceDashboardHtml(native, [{ name: 'organisation', totalTests: 1, passed: 1 }], [], '../test-results', [],
      [{ target: '#test-0', feature: 'organisation', tags: ['@smoke'], retry: 0, durationMs: 10 }]);
    const document = parse(html);

    expect(document.querySelector('#manage-org-report-theme')).not.toBeNull();
    expect(document.querySelector('#manage-org-report-ui')).not.toBeNull();
    expect(document.querySelectorAll('.odhin-dashboard-stack')).toHaveLength(0);
    expect(document.querySelector('#TabDashboard .chart-status-passed-info')?.text).toBe('1');
    expect(document.querySelector('#odhin-feature-summary thead th:last-child')?.text.trim()).toBe('Share of run');
    expect(document.querySelectorAll('#test-list-table thead th').map((cell) => cell.text.trim())).toEqual([
      'Title', 'Status', 'Duration', 'Feature', 'Tags', 'Attempt'
    ]);
    expect(document.querySelector('#test-list-table tbody tr')?.text).toContain('organisation');
    expect(document.querySelector('#test-list-table tbody tr')?.text).toContain('@smoke');
    const repeated = parse(enhancer.enhanceDashboardHtml(html, [{ name: 'organisation', totalTests: 1, passed: 1 }], [], '../test-results', [],
      [{ target: '#test-0', feature: 'organisation', tags: ['@smoke'], retry: 0, durationMs: 10 }]));
    expect(repeated.querySelectorAll('#test-list-table thead th[data-report-metadata]')).toHaveLength(3);
    expect(repeated.querySelectorAll('#test-list-table tbody td[data-report-metadata]')).toHaveLength(3);
    expect(repeated.querySelectorAll('#manage-org-report-theme')).toHaveLength(1);
    expect(repeated.querySelectorAll('#manage-org-report-ui')).toHaveLength(1);
  });

  test('injects the modern presentation for an empty report and remains idempotent', () => {
    const native = '<html><head></head><body id="body-content"><div class="tab"></div><section id="TabDashboard"><div class="container-fluid"><div class="row"></div></div></section></body></html>';
    const once = enhancer.enhanceDashboardHtml(native, []);
    const twice = enhancer.enhanceDashboardHtml(once, []);
    const document = parse(twice);

    expect(document.querySelectorAll('#manage-org-report-theme')).toHaveLength(1);
    expect(document.querySelectorAll('#manage-org-report-ui')).toHaveLength(1);
    expect(document.querySelectorAll('#odhin-datatable-defaults')).toHaveLength(1);
    expect(document.querySelectorAll('.odhin-dashboard-stack')).toHaveLength(0);
  });

  test('keeps failed-result, trace, accessibility and local Perfetto evidence in modern output', () => {
    const native = `<html><head></head><body id="body-content"><div class="tab"></div>
      <section id="TabDashboard"><div class="container-fluid"><div class="row"><div class="col-12"><div class="dashboard-block">
        <div class="info-box-header">Global Summary</div><span class="chart-status-failed-info">1</span>
      </div></div></div></div></section>
      <section id="TabTests"><p>[Failure source: PBA management]</p><div id="TabTrace-1">
        <a class="download-btn" download href="trace.zip">Download trace</a></div></section>
      </body></html>`;
    const html = enhancer.enhanceDashboardHtml(native, [], ['perfetto.json'], 'test-results', [{
      engine: 'axe', testTitle: 'PBA check', violations: [{ rule: 'button-name', impact: 'critical', element: 'button' }], links: []
    }]);
    const document = parse(html);

    expect(document.querySelector('.chart-status-failed-info')?.text).toBe('1');
    expect(document.querySelector('#TabTests')?.text).toContain('[Failure source: PBA management]');
    expect(document.querySelector('#TabTrace-1 a[download]')?.getAttribute('href')).toBe('trace.zip');
    expect(document.querySelector('#TabAccessibility')?.text).toContain('button-name');
    expect(document.querySelector('#TabPerfetto a')?.getAttribute('href')).toBe('test-results/perfetto.json');
    expect(html).not.toContain('trace.playwright.dev');
    expect(html).not.toContain('ui.perfetto.dev');
    expect(html).not.toContain('postMessage(');
  });

  test('propagates an inner onEnd rejection instead of turning publication green', async () => {
    const failure = new Error('Odhín could not write the report');
    const reporter = new OdhinAdaptiveReporter({
      profile: false,
      createInnerReporter: () => ({ onEnd: async () => {
        throw failure;
      } })
    });

    await expect(reporter.onEnd({ status: 'passed' })).rejects.toBe(failure);
  });

  test('propagates an inner onTestEnd rejection at finalisation', async () => {
    const failure = new Error('Odhín could not record the test');
    const reporter = new OdhinAdaptiveReporter({
      profile: false,
      createInnerReporter: () => ({ onTestEnd: async () => {
        throw failure;
      } })
    });

    await reporter.onTestEnd({ title: 'failed record', retries: 0 }, {
      status: 'failed', retry: 0, duration: 1, errors: [], stdout: [], stderr: [], steps: [], attachments: []
    });
    await expect(reporter.onEnd({ status: 'passed' })).rejects.toBe(failure);
  });

  test('propagates required report enhancement failures', async () => {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-odhin-finalise-'));
    const invalidReportFolder = path.join(rootDir, 'not-a-folder.html');
    try {
      fs.writeFileSync(invalidReportFolder, baseHtml);
      const reporter = new OdhinAdaptiveReporter({
        outputFolder: invalidReportFolder,
        profile: false,
        createInnerReporter: () => ({ onEnd: async () => undefined })
      });
      await expect(reporter.onEnd({ status: 'passed' })).rejects.toThrow(/ENOTDIR/);
    } finally {
      fs.rmSync(rootDir, { recursive: true, force: true });
    }
  });

  test('rejects missing, empty and stale Odhín output after a no-write finalisation', async () => {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-odhin-no-write-'));
    const reportDir = path.join(rootDir, 'odhin-report');
    const createReporter = () => new OdhinAdaptiveReporter({
      outputFolder: reportDir,
      indexFilename: 'index.html',
      profile: false,
      createInnerReporter: () => ({ onEnd: async () => undefined })
    });
    try {
      await expect(createReporter().onEnd({ status: 'passed' })).rejects.toThrow(/Odhín.*report/i);
      fs.mkdirSync(reportDir);
      await expect(createReporter().onEnd({ status: 'passed' })).rejects.toThrow(/Odhín.*report/i);
      fs.writeFileSync(path.join(reportDir, 'index.html'), baseHtml);
      fs.utimesSync(path.join(reportDir, 'index.html'), new Date(0), new Date(0));
      await expect(createReporter().onEnd({ status: 'passed' })).rejects.toThrow(/Odhín.*stale/i);
    } finally {
      fs.rmSync(rootDir, { recursive: true, force: true });
    }
  });

  test('rejects a fresh but empty or truncated Odhín index', async () => {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-odhin-partial-'));
    const reportDir = path.join(rootDir, 'odhin-report');
    let content = '';
    try {
      fs.mkdirSync(reportDir);
      const createReporter = () => new OdhinAdaptiveReporter({
        outputFolder: reportDir,
        indexFilename: 'index.html',
        profile: false,
        createInnerReporter: () => ({ onEnd: async () => fs.writeFileSync(path.join(reportDir, 'index.html'), content) })
      });
      await expect(createReporter().onEnd({ status: 'passed' })).rejects.toThrow(/Odhín.*incomplete/i);
      content = '<html><body id="body-content"><section id="TabDashboard">';
      await expect(createReporter().onEnd({ status: 'passed' })).rejects.toThrow(/Odhín.*incomplete/i);
    } finally {
      fs.rmSync(rootDir, { recursive: true, force: true });
    }
  });

  test('labels only evidenced Manage Org failure routes without mutating original errors', async () => {
    const cases = [
      ['/login', 'IDAM authentication'],
      ['/api/organisation', 'Organisation flow'],
      ['/register-org-new/register', 'Organisation flow'],
      ['/api/pba/addDeletePBA', 'PBA management'],
      ['/organisation/update-pba-numbers', 'PBA management'],
      ['/users/invite-user', 'User administration'],
      ['/api/userList?pageNumber=1', 'User administration'],
      ['/api/ogd-flow/invite', 'User administration']
    ];

    for (const [route, source] of cases) {
      let forwarded: { errors: Array<{ message: string; stack: string }> } | undefined;
      const reporter = new OdhinAdaptiveReporter({
        profile: false,
        createInnerReporter: () => ({ onTestEnd: async (_test: unknown, result: typeof forwarded) => {
          forwarded = result;
        } })
      });
      const error = { message: `request failed at https://manage-org.example.test${route}`, stack: `Error at ${route}` };
      const result = { status: 'failed', retry: 0, duration: 1, errors: [error], stdout: [], stderr: [], steps: [], attachments: [] };

      await reporter.onTestEnd({ title: 'failure', retries: 0, location: { file: 'playwright_tests_new/E2E/test/core/example.spec.ts' } }, result);
      await reporter.flushInnerCallbacks();

      expect(forwarded?.errors[0].message).toContain(`[Failure source: ${source}]`);
      expect(forwarded?.errors[0].stack).toContain(`[Failure source: ${source}]`);
      expect(error.message).toBe(`request failed at https://manage-org.example.test${route}`);
      expect(error.stack).toBe(`Error at ${route}`);
    }
  });

  test('does not infer a Manage Org source from unrelated failures', async () => {
    let forwarded: { errors: Array<{ message: string }> } | undefined;
    const reporter = new OdhinAdaptiveReporter({
      profile: false,
      createInnerReporter: () => ({ onTestEnd: async (_test: unknown, result: typeof forwarded) => {
        forwarded = result;
      } })
    });
    const result = { status: 'failed', retry: 0, duration: 1, errors: [{ message: 'GET /api/cases returned 503' }], stdout: [], stderr: [], steps: [], attachments: [] };

    await reporter.onTestEnd({ title: 'unrelated failure', retries: 0 }, result);
    await reporter.flushInnerCallbacks();

    expect(forwarded?.errors[0].message).toBe('GET /api/cases returned 503');
  });

  test('does not apply one route label to unrelated errors in the same result', async () => {
    let forwarded: { errors: Array<{ message: string }> } | undefined;
    const reporter = new OdhinAdaptiveReporter({
      profile: false,
      createInnerReporter: () => ({ onTestEnd: async (_test: unknown, result: typeof forwarded) => {
        forwarded = result;
      } })
    });
    const result = {
      status: 'failed', retry: 0, duration: 1,
      errors: [{ message: 'GET /api/organisation returned 503' }, { message: 'Screenshot upload failed' }],
      stdout: [], stderr: [], steps: [], attachments: []
    };

    await reporter.onTestEnd({ title: 'multiple errors', retries: 0 }, result);
    await reporter.flushInnerCallbacks();

    expect(forwarded?.errors[0].message).toContain('[Failure source: Organisation flow]');
    expect(forwarded?.errors[1].message).toBe('Screenshot upload failed');
  });

  test('renders WAVE rule, selector and code-location hints from adjacent evidence with safe local links', () => {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-odhin-wave-'));
    const reportDir = path.join(rootDir, 'odhin-report');
    const evidenceDir = path.join(reportDir, 'accessibility-evidence');
    const evidenceBase = 'organisation-wave-accessibility-issues';

    try {
      fs.mkdirSync(evidenceDir, { recursive: true });
      fs.writeFileSync(path.join(reportDir, 'report.html'), baseHtml);
      fs.mkdirSync(path.join(rootDir, 'test-results'));
      fs.writeFileSync(path.join(rootDir, 'test-results', 'perfetto.json'), '{}');
      fs.writeFileSync(path.join(evidenceDir, `${evidenceBase}.html`), '<html>existing evidence</html>');
      fs.writeFileSync(path.join(evidenceDir, `${evidenceBase}-highlighted-screenshot.png`), 'fixture');
      fs.writeFileSync(path.join(evidenceDir, `${evidenceBase}.json`), JSON.stringify({
        violationCount: 1,
        violations: [{ rule: 'accessible-name', message: 'Add a label', selector: '#private-avery.active@example.com', codeLocation: { tag: 'button', id: 'avery.active@example.com', testId: 'case-123456789', classes: 'private-user' } }]
      }));
      fs.writeFileSync(path.join(evidenceDir, `manifest-entry-${evidenceBase}.json`), JSON.stringify({
        testTitle: 'organisation page', htmlFileName: `${evidenceBase}.html`, jsonFileName: `${evidenceBase}.json`,
        screenshotFileName: `${evidenceBase}-highlighted-screenshot.png`, violationCount: 1, rules: ['accessible-name']
      }));

      enhancer.enhanceGeneratedReport(reportDir, new Map([['organisation', { name: 'organisation', totalTests: 1, passed: 1 }]]));
      const html = fs.readFileSync(path.join(reportDir, 'report.html'), 'utf8');
      const document = parse(html);

      expect(document.querySelector('#TabAccessibility')).not.toBeNull();
      expect(document.querySelector('#odhin-feature-summary')).not.toBeNull();
      expect(document.querySelector('#TabPerfetto')).not.toBeNull();
      expect(document.querySelector('#odhin-accessibility-tab')?.getAttribute('aria-controls')).toBe('TabAccessibility');
      expect(document.querySelector('#TabAccessibility details summary')).not.toBeNull();
      expect(html).toContain('accessible-name');
      expect(html).toContain('button');
      expect(html).not.toContain('avery.active@example.com');
      expect(html).not.toContain('case-123456789');
      expect(html).not.toContain('private-user');
      expect(html).toContain(`href="accessibility-evidence/${evidenceBase}.html"`);
      expect(html).toContain('rel="noopener noreferrer"');
    } finally {
      fs.rmSync(rootDir, { recursive: true, force: true });
    }
  });

  test('rejects hostile manifest filenames and escapes WAVE evidence text', () => {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-odhin-escape-'));
    const reportDir = path.join(rootDir, 'odhin-report');
    const evidenceDir = path.join(reportDir, 'accessibility-evidence');

    try {
      fs.mkdirSync(evidenceDir, { recursive: true });
      fs.writeFileSync(path.join(reportDir, 'report.html'), baseHtml);
      fs.writeFileSync(path.join(evidenceDir, 'safe.html'), 'safe');
      fs.writeFileSync(path.join(evidenceDir, 'safe.json'), JSON.stringify({ violations: [{ rule: '<img src=x onerror=alert(1)>', selector: '"><script>alert(1)</script>', codeLocation: { tag: 'input' } }] }));
      fs.writeFileSync(path.join(evidenceDir, 'manifest-entry-safe.json'), JSON.stringify({ testTitle: '<b>Unsafe title</b>', htmlFileName: 'safe.html', jsonFileName: 'safe.json', violationCount: 1 }));
      fs.writeFileSync(path.join(evidenceDir, 'manifest-entry-hostile.json'), JSON.stringify({ testTitle: 'hostile', htmlFileName: '../outside.html', jsonFileName: 'safe.json', violationCount: 1 }));

      enhancer.enhanceGeneratedReport(reportDir, []);
      const html = fs.readFileSync(path.join(reportDir, 'report.html'), 'utf8');
      const document = parse(html);

      expect(document.querySelector('#TabAccessibility')).not.toBeNull();
      expect(document.querySelectorAll('#TabAccessibility img')).toHaveLength(0);
      expect(document.querySelectorAll('#TabAccessibility script')).toHaveLength(0);
      expect(html).toContain('&lt;img');
      expect(html).toContain('&lt;b&gt;Unsafe title&lt;/b&gt;');
      expect(html).not.toContain('../outside.html');
      expect(html).not.toContain('>hostile<');
    } finally {
      fs.rmSync(rootDir, { recursive: true, force: true });
    }
  });

  test('does not present malformed WAVE details as a clean accessibility result', () => {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-odhin-malformed-'));
    const reportDir = path.join(rootDir, 'odhin-report');
    const evidenceDir = path.join(reportDir, 'accessibility-evidence');

    try {
      fs.mkdirSync(evidenceDir, { recursive: true });
      fs.writeFileSync(path.join(reportDir, 'report.html'), baseHtml);
      fs.writeFileSync(path.join(evidenceDir, 'safe.html'), 'safe');
      fs.writeFileSync(path.join(evidenceDir, 'safe.json'), JSON.stringify({ violationCount: 1 }));
      fs.writeFileSync(path.join(evidenceDir, 'manifest-entry-safe.json'), JSON.stringify({
        testTitle: 'organisation page', htmlFileName: 'safe.html', jsonFileName: 'safe.json', violationCount: 1
      }));

      enhancer.enhanceGeneratedReport(reportDir, []);
      const html = fs.readFileSync(path.join(reportDir, 'report.html'), 'utf8');

      expect(html).not.toContain('No detected issues in this evidence.');
      expect(html).not.toContain('organisation page');

      fs.writeFileSync(path.join(evidenceDir, 'safe.json'), JSON.stringify({ violationCount: 0, violations: [] }));
      fs.writeFileSync(path.join(reportDir, 'report.html'), baseHtml);
      enhancer.enhanceGeneratedReport(reportDir, []);
      expect(fs.readFileSync(path.join(reportDir, 'report.html'), 'utf8')).not.toContain('organisation page');
    } finally {
      fs.rmSync(rootDir, { recursive: true, force: true });
    }
  });

  test('does not traverse a symlinked accessibility evidence directory', () => {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-odhin-symlink-'));
    const reportDir = path.join(rootDir, 'odhin-report');
    const outsideDir = path.join(rootDir, 'outside-evidence');

    try {
      fs.mkdirSync(reportDir);
      fs.mkdirSync(outsideDir);
      fs.writeFileSync(path.join(reportDir, 'report.html'), baseHtml);
      fs.writeFileSync(path.join(outsideDir, 'safe.html'), 'safe');
      fs.writeFileSync(path.join(outsideDir, 'safe.json'), JSON.stringify({ violations: [] }));
      fs.writeFileSync(path.join(outsideDir, 'manifest-entry-safe.json'), JSON.stringify({
        testTitle: 'outside evidence', htmlFileName: 'safe.html', jsonFileName: 'safe.json', violationCount: 0
      }));
      fs.symlinkSync(outsideDir, path.join(reportDir, 'accessibility-evidence'), 'dir');

      enhancer.enhanceGeneratedReport(reportDir, []);
      const html = fs.readFileSync(path.join(reportDir, 'report.html'), 'utf8');

      expect(html).not.toContain('outside evidence');
    } finally {
      fs.rmSync(rootDir, { recursive: true, force: true });
    }
  });

  test('adds an axe rule, impact and affected element from AxeUtils HTML without embedding raw DOM', async () => {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-odhin-axe-'));
    const reportDir = path.join(rootDir, 'odhin-report');
    const axeHtml = '<html><body><div class="violationCard"><div class="violationCardLine"><p class="card-title"><a id="1">1.</a> Buttons must have discernible text</p><a class="learnMore" href="https://dequeuniversity.com/rules/axe/4.10/button-name">Learn more</a></div><div class="violationCardLine"><p class="card-subtitle">button-name</p><p class="card-subtitle">WCAG 4.1.2</p></div><div class="violationCardLine"><p class="card-text">Element lacks a label</p><p class="card-subtitle">critical</p></div><table><tr><td><pre><code class="css text-wrap">#avery.active@example.com</code></pre><pre><code class="html text-wrap">&lt;button data-token="secret"&gt;&lt;/button&gt;</code></pre></td></tr></table></div></body></html>';

    try {
      fs.mkdirSync(reportDir, { recursive: true });
      let forwardedStatus: string | undefined;
      const reporter = new OdhinAdaptiveReporter({
        outputFolder: reportDir,
        profile: false,
        createInnerReporter: () => ({
          onTestEnd: async (_test: unknown, result: { status: string }) => {
            forwardedStatus = result.status;
          },
          onEnd: async () => {
            fs.writeFileSync(path.join(reportDir, 'report.html'), baseHtml);
          }
        })
      });
      await reporter.onTestEnd({ title: 'invite user', id: 'test-1', retries: 0, location: { file: 'playwright_tests_new/E2E/test/accessibility/manage-organisation.a11y.spec.ts' } }, {
        status: 'passed', retry: 0, duration: 1, errors: [], stdout: [], stderr: [], steps: [],
        attachments: [{ name: 'invite user accessibility report', contentType: 'text/html', body: Buffer.from(axeHtml) }]
      });
      await reporter.onEnd({ status: 'passed' });
      const html = fs.readFileSync(path.join(reportDir, 'report.html'), 'utf8');

      expect(forwardedStatus).toBe('passed');
      expect(html).toContain('button-name');
      expect(html).toContain('critical');
      expect(parse(html).querySelector('#TabAccessibility .odhin-a11y-issues code')?.text).toBe('button');
      expect(html).toContain('href="https://dequeuniversity.com/rules/axe/4.10/button-name"');
      expect(html).not.toContain('data-token');
      expect(html).not.toContain('avery.active@example.com');
    } finally {
      fs.rmSync(rootDir, { recursive: true, force: true });
    }
  });

  test('marks a truncated Axe attachment unavailable instead of clean', () => {
    const entries = enhancer.extractAxeEvidence({ title: 'invite user' }, {
      attachments: [{
        name: 'invite user accessibility report', contentType: 'text/html',
        body: Buffer.from('<h1>Consolidated Accessibility Report</h1>')
      }]
    });
    const html = enhancer.__test__.enhanceDashboardHtml(baseHtml, [], [], '../test-results', entries);

    expect(html).toContain('Evidence unavailable or incomplete');
    expect(html).not.toContain('No detected issues in this evidence.');
  });

  test('does not call a mixed clean and truncated Axe attachment clean', () => {
    const entries = enhancer.extractAxeEvidence({ title: 'invite user' }, {
      attachments: [{
        name: 'invite user accessibility report', contentType: 'text/html',
        body: Buffer.from('<h1>Consolidated Accessibility Report</h1><details><summary>Page 1: users</summary><h2>axe-core found <span>0</span> violations</h2></details><details><summary>Page 2: FAILED users/suspend</summary></details>')
      }]
    });
    const html = enhancer.__test__.enhanceDashboardHtml(baseHtml, [], [], '../test-results', entries);

    expect(html).toContain('Evidence unavailable or incomplete');
    expect(html).not.toContain('No detected issues in this evidence.');
  });

  test('marks an Axe attachment incomplete when a later page summary is truncated', () => {
    for (const incompletePage of ['<details></details>', '<details><summary>Page 2</summary></details>']) {
      const entries = enhancer.extractAxeEvidence({ title: 'invite user' }, {
        attachments: [{
          name: 'invite user accessibility report', contentType: 'text/html',
          body: Buffer.from(`<h1>Consolidated Accessibility Report</h1><details><summary>Page 1: users</summary><h2>axe-core found <span>0</span> violations</h2></details>${incompletePage}`)
        }]
      });
      const html = enhancer.__test__.enhanceDashboardHtml(baseHtml, [], [], '../test-results', entries);

      expect(html).toContain('Evidence unavailable or incomplete');
      expect(html).not.toContain('No detected issues in this evidence.');
    }
  });

  test('calls a complete multi-page Axe attachment clean', () => {
    const entries = enhancer.extractAxeEvidence({ title: 'invite user' }, {
      attachments: [{
        name: 'invite user accessibility report', contentType: 'text/html',
        body: Buffer.from('<h1>Consolidated Accessibility Report</h1><details><summary>Page 1: users</summary><h2>axe-core found <span>0</span> violations</h2></details><details><summary>Page 2: users/details</summary><h2>axe-core found <span>0</span> violations</h2></details>')
      }]
    });
    const html = enhancer.__test__.enhanceDashboardHtml(baseHtml, [], [], '../test-results', entries);

    expect(html).toContain('No detected issues in this evidence.');
    expect(html).not.toContain('Evidence unavailable or incomplete');
  });

  test('does not create unsafe Perfetto links from hostile filenames or URL schemes', () => {
    const html = enhancer.__test__.enhanceDashboardHtml(baseHtml, [], ['perfetto.json', 'perfetto-"><script>alert(1)</script>.json'], 'javascript:alert(1)');
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).not.toContain('href="javascript:');
  });
});
