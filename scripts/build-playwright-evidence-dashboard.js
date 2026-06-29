#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_ROOT_DIR = 'functional-output/tests';
const DEFAULT_TITLE = 'Manage Org Playwright Evidence';

const LANES = [
  {
    id: 'smoke',
    name: 'Smoke',
    purpose: 'PR smoke checks for login reachability and protected-route redirect behaviour.',
    artifacts: [
      artifact('Odhin report', ['playwright-smoke/odhin-report/xui-playwright-smoke.html'], true),
      artifact('Playwright HTML', ['playwright-smoke/html-report/index.html', 'playwright-smoke/index.html'], false),
      artifact('JUnit XML', ['playwright-smoke/playwright-smoke-junit.xml'], true),
      artifact('Stable failure artifacts', ['playwright-smoke/stable-artifacts'], false),
    ],
  },
  {
    id: 'api',
    name: 'API functional',
    purpose: 'HTTP-level Manage Organisation functional coverage using Playwright APIRequestContext.',
    artifacts: [
      artifact('Odhin report', ['playwright-api/odhin-report/xui-mo-playwright-api.html'], true),
      artifact('Playwright HTML', ['playwright-api/html-report/index.html', 'playwright-api/index.html'], false),
      artifact('JUnit XML', ['playwright-api/playwright-api-junit.xml'], true),
      artifact('Load profile', ['playwright-api/odhin-report/load-profile/load-profile.html'], false),
      artifact('Stable failure artifacts', ['playwright-api/stable-artifacts'], false),
    ],
  },
  {
    id: 'integration',
    name: 'Integration',
    purpose: 'Mock-backed UI integration coverage for fast workflow and edge-case validation.',
    artifacts: [
      artifact('Odhin report', ['playwright-integration/odhin-report/xui-mo-playwright-integration.html'], true),
      artifact('Playwright HTML', ['playwright-integration/index.html', 'playwright-integration/html-report/index.html'], false),
      artifact('JUnit XML', ['playwright-integration/playwright-integration-junit.xml'], true),
      artifact('Load profile', ['playwright-integration/odhin-report/load-profile/load-profile.html'], false),
      artifact('Stable failure artifacts', ['playwright-integration/stable-artifacts'], false),
    ],
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    purpose: 'Unified axe and WAVE-like accessibility evidence for deployed routes and validation states.',
    artifacts: [
      artifact('Odhin report', ['playwright-accessibility/odhin-report/xui-playwright-accessibility.html'], true),
      artifact('Playwright HTML', ['playwright-accessibility/html-report/index.html'], false),
      artifact('JUnit XML', ['playwright-accessibility/playwright-accessibility-junit.xml'], true),
      artifact('WAVE-like evidence', ['playwright-accessibility/odhin-report/accessibility-evidence/index.html'], false),
      artifact('Stable failure artifacts', ['playwright-accessibility/stable-artifacts'], false),
    ],
  },
  {
    id: 'e2e',
    name: 'E2E',
    purpose: 'Deployed browser journeys for authentication, registration, organisation, and user-admin workflows.',
    artifacts: [
      artifact('Odhin report', ['playwright-e2e/odhin-report/xui-playwright-e2e.html'], true),
      artifact('Playwright HTML', ['playwright-e2e/index.html', 'playwright-e2e/html-report/index.html'], false),
      artifact('JUnit XML', ['playwright-e2e/playwright-e2e-junit.xml'], true),
      artifact('Load profile', ['playwright-e2e/odhin-report/load-profile/load-profile.html'], false),
      artifact('Stable failure artifacts', ['playwright-e2e/stable-artifacts'], false),
    ],
  },
];

function artifact(label, paths, required) {
  return { label, paths, required };
}

function parseArgs(argv) {
  const options = {
    outputDir: process.env.MANAGE_ORG_EVIDENCE_OUTPUT_DIR || '',
    packageJsonPath: process.env.MANAGE_ORG_EVIDENCE_PACKAGE_JSON || 'package.json',
    rootDir: process.env.MANAGE_ORG_EVIDENCE_ROOT || DEFAULT_ROOT_DIR,
    title: process.env.MANAGE_ORG_EVIDENCE_TITLE || DEFAULT_TITLE,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === '--root-dir' && next) {
      options.rootDir = next;
      index += 1;
    } else if (arg === '--output-dir' && next) {
      options.outputDir = next;
      index += 1;
    } else if (arg === '--title' && next) {
      options.title = next;
      index += 1;
    } else if (arg === '--package-json' && next) {
      options.packageJsonPath = next;
      index += 1;
    }
  }

  if (!options.outputDir) {
    options.outputDir = path.join(options.rootDir, 'manage-org-evidence');
  }

  return options;
}

function buildPlaywrightEvidenceDashboard(options = {}) {
  const parsedOptions = parseArgs([]);
  const resolvedOptions = {
    ...parsedOptions,
    ...options,
  };
  if (!options.outputDir && !process.env.MANAGE_ORG_EVIDENCE_OUTPUT_DIR) {
    resolvedOptions.outputDir = path.join(resolvedOptions.rootDir, 'manage-org-evidence');
  }

  buildWaveLikeEvidenceIndex(path.resolve(resolvedOptions.rootDir || DEFAULT_ROOT_DIR));
  const model = buildEvidenceModel(resolvedOptions);
  fs.mkdirSync(resolvedOptions.outputDir, { recursive: true });
  const dashboardPath = path.join(resolvedOptions.outputDir, 'index.html');
  fs.writeFileSync(dashboardPath, buildDashboardHtml(model), 'utf8');
  return { dashboardPath, model };
}

function buildWaveLikeEvidenceIndex(rootDir) {
  const evidenceDir = path.join(rootDir, 'playwright-accessibility/odhin-report/accessibility-evidence');
  if (!fs.existsSync(evidenceDir)) {
    return '';
  }

  const entries = fs
    .readdirSync(evidenceDir)
    .filter((fileName) => fileName.startsWith('manifest-entry-') && fileName.endsWith('.json'))
    .map((fileName) => readWaveEvidenceEntry(path.join(evidenceDir, fileName)))
    .filter(Boolean)
    .sort((a, b) => a.testTitle.localeCompare(b.testTitle) || a.attachmentPrefix.localeCompare(b.attachmentPrefix));

  if (entries.length === 0) {
    return '';
  }

  const summaryRows = buildWaveIssueSummary(entries)
    .map(
      (item) => `
        <tr>
          <th scope="row">${escapeHtml(item.label)}</th>
          <td>${item.screenCount}</td>
          <td>${escapeHtml(item.hint)}</td>
          <td>${escapeHtml(item.examples.join(', '))}</td>
        </tr>`
    )
    .join('\n');
  const rows = entries
    .map(
      (entry) => `
        <li>
          <a class="issue-link" href="./${escapeHtml(entry.htmlFileName)}">${escapeHtml(entry.testTitle)}</a>
          <p>${entry.violationCount} WAVE-like rule issue(s): ${escapeHtml(entry.rules.join(', ') || 'none')}</p>
          <a href="./${escapeHtml(entry.screenshotFileName)}">screenshot</a>
          |
          <a href="./${escapeHtml(entry.jsonFileName)}">DOM and WAVE-like JSON</a>
        </li>`
    )
    .join('\n');

  const indexPath = path.join(evidenceDir, 'index.html');
  fs.writeFileSync(
    indexPath,
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>WAVE-like Accessibility Evidence</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; color: #0b0c0c; }
      .banner { background: #1d70b8; color: #fff; padding: 16px; margin-bottom: 24px; }
      .issue-link { font-weight: bold; font-size: 18px; }
      li { margin-bottom: 16px; }
      table { border-collapse: collapse; margin: 24px 0; width: 100%; }
      th, td { border-bottom: 1px solid #b1b4b6; padding: 8px; text-align: left; vertical-align: top; }
    </style>
  </head>
  <body>
    <div class="banner">
      <h1>WAVE-like Accessibility Evidence</h1>
      <p>Open each item for rule, DOM selector, page screenshot, and JSON evidence.</p>
    </div>
    ${summaryRows ? `<h2>Issue Summary</h2>
    <table>
      <thead>
        <tr>
          <th scope="col">Issue</th>
          <th scope="col">Screens</th>
          <th scope="col">Fix hint</th>
          <th scope="col">Examples</th>
        </tr>
      </thead>
      <tbody>${summaryRows}</tbody>
    </table>` : ''}
    <ol>${rows}</ol>
  </body>
</html>
`,
    'utf8'
  );
  return indexPath;
}

function buildWaveIssueSummary(entries) {
  const byRule = new Map();
  for (const entry of entries) {
    const rules = entry.rules.length > 0 ? entry.rules : ['none'];
    for (const rule of rules) {
      if (!byRule.has(rule)) {
        byRule.set(rule, { examples: new Set(), rule, screens: new Set() });
      }
      const item = byRule.get(rule);
      item.screens.add(entry.testTitle);
      item.examples.add(entry.testTitle);
    }
  }

  return Array.from(byRule.values())
    .map((item) => ({
      examples: Array.from(item.examples).slice(0, 3),
      hint: issueFixHint(item.rule, item.screens.size),
      label: issueLabel(item.rule),
      screenCount: item.screens.size,
    }))
    .sort((a, b) => b.screenCount - a.screenCount || a.label.localeCompare(b.label));
}

function issueLabel(rule) {
  if (rule === 'none') {
    return 'No WAVE-like issue';
  }
  if (/skip-link|main-landmark|h1-count|heading|fieldset|label|accessible-name/i.test(rule)) {
    return `Screen-reader issue(s): ${rule}`;
  }
  return rule;
}

function issueFixHint(rule, screenCount) {
  if (rule === 'none') {
    return 'No fix needed';
  }
  if (screenCount > 1 && /skip-link|main-landmark/i.test(rule)) {
    return 'likely shared app shell fix';
  }
  if (screenCount > 1) {
    return 'likely shared component/template fix';
  }
  return 'inspect linked page evidence';
}

function readWaveEvidenceEntry(filePath) {
  try {
    const entry = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (
      entry &&
      typeof entry.testTitle === 'string' &&
      typeof entry.attachmentPrefix === 'string' &&
      typeof entry.htmlFileName === 'string' &&
      typeof entry.jsonFileName === 'string' &&
      typeof entry.screenshotFileName === 'string' &&
      typeof entry.violationCount === 'number' &&
      Array.isArray(entry.rules)
    ) {
      return entry;
    }
  } catch {
    return null;
  }
  return null;
}

function buildEvidenceModel(options) {
  const artifactBaseUrl = buildArtifactBaseUrl(process.env.BUILD_URL || '');
  const rootDir = path.resolve(options.rootDir || DEFAULT_ROOT_DIR);
  const rootArtifactPath = toPosix(options.rootDir || DEFAULT_ROOT_DIR);
  const outputDir = path.resolve(options.outputDir || path.join(rootDir, 'manage-org-evidence'));
  const packageSummary = buildPackageSummary(options.packageJsonPath);
  const generatedAt = new Date().toISOString();

  const lanes = LANES.map((lane) => {
    const artifacts = lane.artifacts.map((laneArtifact) =>
      resolveArtifact(laneArtifact, rootDir, outputDir, rootArtifactPath, artifactBaseUrl)
    );
    const requiredArtifacts = artifacts.filter((laneArtifact) => laneArtifact.required);
    const existingArtifacts = artifacts.filter((laneArtifact) => laneArtifact.exists);
    const existingRequiredArtifacts = requiredArtifacts.filter((laneArtifact) => laneArtifact.exists);
    const status =
      requiredArtifacts.length > 0 && existingRequiredArtifacts.length === requiredArtifacts.length
        ? 'ready'
        : existingArtifacts.length > 0
          ? 'partial'
          : 'missing';

    return {
      ...lane,
      artifacts,
      status,
      statusLabel: status === 'ready' ? 'Ready' : status === 'partial' ? 'Partial' : 'Missing',
    };
  });

  return {
    buildUrl: sanitizeDisplayUrl(process.env.BUILD_URL || ''),
    branch: process.env.BRANCH_NAME || process.env.GIT_BRANCH || process.env.PLAYWRIGHT_REPORT_BRANCH || '',
    generatedAt,
    lanes,
    outputDir,
    packageSummary,
    rootDir,
    testUrl: sanitizeDisplayUrl(process.env.TEST_URL || ''),
    title: options.title || DEFAULT_TITLE,
  };
}

function resolveArtifact(laneArtifact, rootDir, outputDir, rootArtifactPath, artifactBaseUrl) {
  const candidates = laneArtifact.paths.map((relativePath) => ({
    absolutePath: path.join(rootDir, relativePath),
    relativePath,
  }));
  const found = candidates.find((candidate) => fs.existsSync(candidate.absolutePath));
  const selected = found || candidates[0];

  return {
    exists: Boolean(found),
    label: laneArtifact.label,
    link: found ? buildArtifactLink(selected, outputDir, rootArtifactPath, artifactBaseUrl) : '',
    required: laneArtifact.required,
    selectedPath: selected.relativePath,
  };
}

function buildArtifactBaseUrl(buildUrl) {
  if (!buildUrl) {
    return '';
  }

  try {
    const url = new URL(buildUrl);
    url.username = '';
    url.password = '';
    url.search = '';
    url.hash = '';
    if (!url.pathname.endsWith('/')) {
      url.pathname = `${url.pathname}/`;
    }
    return new URL('artifact/', url).toString();
  } catch {
    return '';
  }
}

function buildArtifactLink(selected, outputDir, rootArtifactPath, artifactBaseUrl) {
  if (artifactBaseUrl) {
    return `${artifactBaseUrl}${encodeURI(toPosix(path.join(rootArtifactPath, selected.relativePath)))}`;
  }

  return toPosix(path.relative(outputDir, selected.absolutePath));
}

function sanitizeDisplayUrl(value) {
  const rawValue = String(value || '').trim();
  if (!rawValue) {
    return '';
  }

  try {
    const url = new URL(rawValue);
    url.username = '';
    url.password = '';
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return rawValue.replace(/\/\/[^/@]+@/, '//[redacted]@').split(/[?#]/)[0];
  }
}

function buildPackageSummary(packageJsonPath) {
  const summary = {
    replacementScripts: [],
  };

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = packageJson.scripts || {};
    summary.replacementScripts = [
      'test:smoke',
      'test:api:pw',
      'test:playwright:integration',
      'test:accessibility:playwright',
      'test:playwrightE2E',
      'test:crossbrowser',
    ].filter((name) => Boolean(scripts[name]));
  } catch {
    // Keep the dashboard useful in partial Jenkins workspaces.
  }

  return summary;
}

function buildDashboardHtml(model) {
  const laneRows = model.lanes
    .map(
      (lane) => `
        <tr>
          <th scope="row">${escapeHtml(lane.name)}</th>
          <td><strong class="status status-${escapeHtml(lane.status)}">${escapeHtml(lane.statusLabel)}</strong></td>
          <td>${escapeHtml(lane.purpose)}</td>
          <td>
            <ul>
              ${lane.artifacts.map(renderArtifact).join('\n')}
            </ul>
          </td>
        </tr>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(model.title)}</title>
    <style>
      body { color: #0b0c0c; font-family: Arial, sans-serif; margin: 2rem; }
      h1 { margin-bottom: 0.25rem; }
      h2 { margin-top: 2rem; }
      table { border-collapse: collapse; margin-top: 1rem; width: 100%; }
      th, td { border-bottom: 1px solid #b1b4b6; padding: 0.75rem; text-align: left; vertical-align: top; }
      th { font-weight: 700; }
      code { background: #f3f2f1; padding: 0.1rem 0.25rem; }
      ul { margin: 0; padding-left: 1rem; }
      .meta { color: #505a5f; margin-top: 0; }
      .panel { border-left: 6px solid #1d70b8; background: #f3f2f1; margin-top: 1.5rem; padding: 1rem; }
      .status { display: inline-block; font-weight: 700; min-width: 4.5rem; }
      .status-ready { color: #00703c; }
      .status-partial { color: #594d00; }
      .status-missing { color: #942514; }
      .missing { color: #942514; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(model.title)}</h1>
    <p class="meta">Generated ${escapeHtml(model.generatedAt)}</p>
    <div class="panel">
      <p><strong>Branch:</strong> ${escapeHtml(model.branch || 'not reported')}</p>
      <p><strong>Build:</strong> ${model.buildUrl ? `<a href="${escapeHtml(model.buildUrl)}">${escapeHtml(model.buildUrl)}</a>` : 'not reported'}</p>
      <p><strong>Target URL:</strong> ${escapeHtml(model.testUrl || 'not reported')}</p>
      <p><strong>Output root:</strong> <code>${escapeHtml(toPosix(model.rootDir))}</code></p>
    </div>

    <h2>Playwright Evidence Lanes</h2>
    <table>
      <thead>
        <tr>
          <th scope="col">Lane</th>
          <th scope="col">Status</th>
          <th scope="col">Purpose</th>
          <th scope="col">Evidence</th>
        </tr>
      </thead>
      <tbody>
        ${laneRows}
      </tbody>
    </table>

    <h2>Retirement Position</h2>
    <p>Playwright is the authoritative Manage Organisation functional gate for smoke, API, integration, unified accessibility, and E2E coverage.</p>
    <p><strong>Replacement scripts:</strong> ${escapeHtml(model.packageSummary.replacementScripts.join(', ') || 'not detected')}</p>
    <p><strong>Retired aliases:</strong> removed from package.json and blocked by the architecture guard.</p>
  </body>
</html>
`;
}

function renderArtifact(laneArtifact) {
  const requirement = laneArtifact.required ? 'required' : 'optional';
  if (laneArtifact.exists) {
    return `<li><a href="${escapeHtml(laneArtifact.link)}">${escapeHtml(laneArtifact.label)}</a> <span>(${requirement})</span></li>`;
  }
  return `<li><span class="missing">${escapeHtml(laneArtifact.label)} missing</span> <code>${escapeHtml(
    laneArtifact.selectedPath
  )}</code> <span>(${requirement})</span></li>`;
}

function toPosix(value) {
  return String(value).split(path.sep).join('/');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

if (require.main === module) {
  try {
    const result = buildPlaywrightEvidenceDashboard(parseArgs(process.argv.slice(2)));
    console.log(`build-playwright-evidence-dashboard: wrote ${result.dashboardPath}`);
  } catch (error) {
    console.error(`build-playwright-evidence-dashboard: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  buildDashboardHtml,
  buildEvidenceModel,
  buildPlaywrightEvidenceDashboard,
  buildWaveLikeEvidenceIndex,
  parseArgs,
};
