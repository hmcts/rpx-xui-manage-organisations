#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_ROOT_DIR = 'functional-output/tests';
const DEFAULT_TITLE = 'Manage Org Playwright Evidence';
const DEFAULT_API_PACKAGE_JSON = 'api/package.json';

const COVERAGE_ARTIFACTS = [
  artifact('Node coverage HTML', ['../../reports/tests/coverage/node/index.html'], false),
  artifact('Angular coverage HTML', ['../../reports/tests/coverage/ng/html-report/index.html', '../../reports/tests/coverage/ng/index.html'], false),
  artifact('Node LCOV', ['../../reports/tests/coverage/node/lcov.info'], false),
  artifact('Angular LCOV', ['../../reports/tests/coverage/ng/lcov.info'], false),
];

const COVERAGE_SCRIPT_NAMES = ['test:coverage', 'test:coverage:ng', 'test:coverage:node'];
const NODE_COVERAGE_METRICS = ['statements', 'branches', 'functions', 'lines'];

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
    id: 'a11y',
    name: 'Accessibility',
    purpose: 'Dedicated axe accessibility scans for deployed E2E and mocked integration routes.',
    artifacts: [
      artifact('E2E Odhin report', ['playwright-a11y/odhin-report/xui-playwright-a11y.html'], true),
      artifact('E2E Playwright HTML', ['playwright-a11y/html-report/index.html'], false),
      artifact('E2E JUnit XML', ['playwright-a11y/playwright-a11y-junit.xml'], true),
      artifact('Integration Odhin report', ['playwright-a11y/integration/odhin-report/xui-playwright-a11y-integration.html'], true),
      artifact('Integration Playwright HTML', ['playwright-a11y/integration/html-report/index.html'], false),
      artifact('Integration JUnit XML', ['playwright-a11y/integration/playwright-a11y-integration-junit.xml'], true),
      artifact('Stable failure artifacts', ['playwright-a11y/stable-artifacts'], false),
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
      artifact('Stable failure artifacts', ['playwright-e2e/stable-artifacts'], false),
    ],
  },
];

function artifact(label, paths, required) {
  return { label, paths, required };
}

function parseArgs(argv) {
  const options = {
    apiPackageJsonPath: process.env.MANAGE_ORG_EVIDENCE_API_PACKAGE_JSON || DEFAULT_API_PACKAGE_JSON,
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
    } else if (arg === '--api-package-json' && next) {
      options.apiPackageJsonPath = next;
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

  const model = buildEvidenceModel(resolvedOptions);
  fs.mkdirSync(resolvedOptions.outputDir, { recursive: true });
  const dashboardPath = path.join(resolvedOptions.outputDir, 'index.html');
  fs.writeFileSync(dashboardPath, buildDashboardHtml(model), 'utf8');
  return { dashboardPath, model };
}

function buildEvidenceModel(options) {
  const artifactBaseUrl = buildArtifactBaseUrl(process.env.BUILD_URL || '');
  const rootDir = path.resolve(options.rootDir || DEFAULT_ROOT_DIR);
  const rootArtifactPath = toPosix(options.rootDir || DEFAULT_ROOT_DIR);
  const outputDir = path.resolve(options.outputDir || path.join(rootDir, 'manage-org-evidence'));
  const packageSummary = buildPackageSummary(options.packageJsonPath);
  const coverageSummary = buildCoverageSummary(options, rootDir, outputDir, rootArtifactPath, artifactBaseUrl);
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
    coverageSummary,
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
    retiredAliases: [],
    replacementScripts: [],
  };

  const packageJson = readJsonFile(packageJsonPath);
  if (!packageJson) {
    return summary;
  }

  const scripts = packageJson.scripts || {};
  summary.retiredAliases = Object.entries(scripts)
    .filter(([, command]) => /retired-codecept-runner\.js\s+(fail|bridge)\b/.test(String(command)))
    .map(([name]) => name)
    .sort();
  summary.replacementScripts = [
    'test:smoke',
    'test:api:pw',
    'test:playwright:integration',
    'test:a11y:playwright',
    'test:playwrightE2E',
    'test:crossbrowser',
  ].filter((name) => Boolean(scripts[name]));

  return summary;
}

function buildCoverageSummary(options, rootDir, outputDir, rootArtifactPath, artifactBaseUrl) {
  const packageJson = readJsonFile(options.packageJsonPath);
  const apiPackageJson = readJsonFile(options.apiPackageJsonPath);
  const scripts = packageJson?.scripts || {};
  const nycConfig = apiPackageJson?.nyc || null;

  return {
    artifacts: COVERAGE_ARTIFACTS.map((coverageArtifact) =>
      resolveArtifact(coverageArtifact, rootDir, outputDir, rootArtifactPath, artifactBaseUrl)
    ),
    node: buildNodeCoverageSummary(nycConfig),
    scripts: COVERAGE_SCRIPT_NAMES.map((name) => ({
      command: scripts[name] || '',
      name,
    })),
  };
}

function buildNodeCoverageSummary(nycConfig) {
  if (!nycConfig) {
    return {
      detected: false,
      gateLabel: 'Not detected',
      scopeLabel: 'Not detected',
      thresholds: NODE_COVERAGE_METRICS.map((metric) => ({
        metric,
        value: 'not set',
      })),
    };
  }

  return {
    detected: true,
    gateLabel: nycConfig['check-coverage'] ? 'Enabled' : 'Disabled',
    scopeLabel: nycConfig['per-file'] ? 'Per-file' : 'Aggregate',
    thresholds: NODE_COVERAGE_METRICS.map((metric) => ({
      metric,
      value: formatCoverageThreshold(nycConfig[metric]),
    })),
  };
}

function formatCoverageThreshold(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'not set';
  }
  return `${value}%`;
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

    <h2>Coverage Position</h2>
    <p>Coverage gates stay separate from Playwright functional evidence, but the dashboard links them so reviewers can see the current unit-test ratchet state beside the migrated suite evidence.</p>
    <table>
      <thead>
        <tr>
          <th scope="col">Coverage command</th>
          <th scope="col">Configured script</th>
        </tr>
      </thead>
      <tbody>
        ${model.coverageSummary.scripts.map(renderCoverageScript).join('\n')}
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th scope="col">Node coverage gate</th>
          <th scope="col">Scope</th>
          <th scope="col">Statements</th>
          <th scope="col">Branches</th>
          <th scope="col">Functions</th>
          <th scope="col">Lines</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${escapeHtml(model.coverageSummary.node.gateLabel)}</td>
          <td>${escapeHtml(model.coverageSummary.node.scopeLabel)}</td>
          ${model.coverageSummary.node.thresholds
            .map((threshold) => `<td>${escapeHtml(threshold.value)}</td>`)
            .join('\n')}
        </tr>
      </tbody>
    </table>
    <p><strong>Coverage report evidence:</strong></p>
    <ul>
      ${model.coverageSummary.artifacts.map(renderArtifact).join('\n')}
    </ul>

    <h2>Retirement Position</h2>
    <p>Playwright is the authoritative Manage Organisation functional gate for smoke, API, integration, accessibility, and E2E coverage.</p>
    <p><strong>Replacement scripts:</strong> ${escapeHtml(model.packageSummary.replacementScripts.join(', ') || 'not detected')}</p>
    <p><strong>Retired aliases guarded:</strong> ${escapeHtml(model.packageSummary.retiredAliases.join(', ') || 'not detected')}</p>
  </body>
</html>
`;
}

function renderCoverageScript(coverageScript) {
  return `
        <tr>
          <th scope="row"><code>${escapeHtml(coverageScript.name)}</code></th>
          <td>${coverageScript.command ? `<code>${escapeHtml(coverageScript.command)}</code>` : '<span class="missing">not detected</span>'}</td>
        </tr>`;
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

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    // Keep the dashboard useful in partial Jenkins workspaces.
    return null;
  }
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
  buildCoverageSummary,
  parseArgs,
};
