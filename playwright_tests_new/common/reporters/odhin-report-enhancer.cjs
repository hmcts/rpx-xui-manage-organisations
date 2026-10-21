/* global require, module */

const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');
const { applyPresentation } = require('./presentation/enhance.cjs');

function deriveFeatureName(filePath) {
  const normalized = String(filePath ?? '')
    .replace(/\\/g, '/')
    .trim();

  if (!normalized) {
    return 'unknown';
  }

  const rootedPatterns = [
    /\/playwright_tests_new\/integration\/test\/([^/]+)\//i,
    /\/playwright_tests_new\/E2E\/tests?\/([^/]+)\//i,
    /\/playwright_tests_new\/e2e\/tests?\/([^/]+)\//i,
    /\/playwright_tests_new\/api\/([^/]+)\//i,
    /\/tests?\/([^/]+)\//i,
  ];

  for (const pattern of rootedPatterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  const baseName = normalized.split('/').pop() ?? normalized;
  return baseName.replace(/\.[^.]+$/, '');
}

function createEmptyFeatureStat(name) {
  return {
    name,
    totalTests: 0,
    durationMs: 0,
    passed: 0,
    failed: 0,
    timedOut: 0,
    skipped: 0,
    interrupted: 0,
    flaky: 0,
  };
}

function normalizeFeatureStats(featureStats) {
  const source =
    featureStats instanceof Map
      ? Array.from(featureStats.values())
      : Array.isArray(featureStats)
        ? featureStats
        : Object.values(featureStats ?? {});

  return source
    .map((entry) => ({
      ...createEmptyFeatureStat(String(entry?.name ?? 'unknown')),
      ...entry,
      totalTests: Number(entry?.totalTests ?? 0),
      durationMs: Number(entry?.durationMs ?? 0),
      passed: Number(entry?.passed ?? 0),
      failed: Number(entry?.failed ?? 0),
      timedOut: Number(entry?.timedOut ?? 0),
      skipped: Number(entry?.skipped ?? 0),
      interrupted: Number(entry?.interrupted ?? 0),
      flaky: Number(entry?.flaky ?? 0),
    }))
    .sort((left, right) => {
      if (right.totalTests !== left.totalTests) {
        return right.totalTests - left.totalTests;
      }
      return left.name.localeCompare(right.name);
    });
}

function colorForFeature(name) {
  let hash = 0;
  for (const char of String(name)) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  const hue = hash % 360;
  return `hsl(${hue} 68% 52%)`;
}

function percentOf(total, value) {
  if (!total) {
    return '0.00';
  }
  return ((value / total) * 100).toFixed(2);
}

function formatDuration(durationMs) {
  const safeDuration = Math.max(0, Math.round(Number(durationMs) || 0));
  const hours = Math.floor(safeDuration / 3600000);
  const minutes = Math.floor((safeDuration % 3600000) / 60000);
  const seconds = Math.floor((safeDuration % 60000) / 1000);
  const milliseconds = safeDuration % 1000;
  return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeElementTag(value) {
  const tag = String(value ?? '').toLowerCase();
  return /^[a-z][a-z0-9-]{0,31}$/.test(tag) ? tag : 'not available';
}

function injectEnhancerStyles(root) {
  const head = root.querySelector('head');
  if (!head || root.querySelector('#odhin-enhancer-styles')) {
    return;
  }

  head.appendChild(
    parse(`
<style id="odhin-enhancer-styles">
  #TabAccessibility { color: #17324d; }
  #TabAccessibility .odhin-a11y-intro { max-width: 72ch; margin: 0 0 18px; color: #41566b; }
  #TabAccessibility .odhin-a11y-card { border: 1px solid #cfdae5; border-radius: 10px; background: #fff; margin: 12px 0; }
  #TabAccessibility .odhin-a11y-card summary { cursor: pointer; padding: 14px 18px; font-weight: 700; background: #f3f8fc; border-radius: 10px; }
  #TabAccessibility .odhin-a11y-card[open] summary { border-bottom: 1px solid #cfdae5; border-radius: 10px 10px 0 0; }
  #TabAccessibility .odhin-a11y-body { padding: 12px 18px 18px; }
  #TabAccessibility .odhin-a11y-issues { list-style: none; padding: 0; margin: 12px 0; }
  #TabAccessibility .odhin-a11y-issues li { border-left: 4px solid #1d70b8; padding: 10px 14px; margin: 10px 0; background: #f8fbfe; overflow-wrap: anywhere; }
  #TabAccessibility .odhin-a11y-rule-search { display: block; width: min(100%, 34rem); padding: 8px; margin: 6px 0 10px; border: 2px solid #41566b; border-radius: 4px; }
  #TabAccessibility .odhin-a11y-rule-group { border: 1px solid #cfdae5; border-radius: 8px; background: #fff; margin: 8px 0; padding: 10px 14px; }
  #TabAccessibility .odhin-a11y-rule-group summary { cursor: pointer; font-weight: 700; }
  #TabAccessibility .odhin-a11y-rule-group summary span { margin-left: 12px; font-weight: 400; }
  #TabAccessibility .odhin-a11y-rule-group ul { margin: 12px 0 0; }
  #TabAccessibility .odhin-a11y-rule-group[hidden] { display: none; }
  #TabAccessibility code { white-space: pre-wrap; overflow-wrap: anywhere; }
  #TabAccessibility a { color: #1d70b8; text-decoration: underline; text-underline-offset: 2px; }
  #TabAccessibility a:focus-visible, #odhin-accessibility-tab:focus-visible, #TabAccessibility summary:focus-visible { outline: 3px solid #ffdd00; outline-offset: 3px; box-shadow: 0 0 0 5px #0b0c0c; }
</style>`)
  );
}

function injectDataTableDefaults(root) {
  const body = root.querySelector('body');
  if (!body || root.querySelector('#odhin-datatable-defaults')) {
    return;
  }

  body.appendChild(
    parse(`
<script id="odhin-datatable-defaults">
  (function () {
    var defaultPageLength = 100;
    var maxAttempts = 30;
    var attempt = 0;

    function applyDataTableDefaults() {
      var jq = window.jQuery || window.$;
      if (!jq || !jq.fn || !jq.fn.dataTable) {
        return false;
      }

      if (jq.fn.dataTable.defaults) {
        jq.extend(true, jq.fn.dataTable.defaults, {
          pageLength: defaultPageLength,
          lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'All']],
          stateDuration: -1,
          stateSave: true
        });
      }

      jq('table.dataTable').each(function () {
        if (!jq.fn.dataTable.isDataTable(this)) {
          return;
        }

        jq(this).DataTable().page.len(defaultPageLength).draw(false);
      });

      return true;
    }

    function applyWhenReady() {
      if (applyDataTableDefaults()) {
        return;
      }

      var timer = window.setInterval(function () {
        attempt += 1;
        if (applyDataTableDefaults() || attempt >= maxAttempts) {
          window.clearInterval(timer);
        }
      }, 100);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyWhenReady);
    } else {
      applyWhenReady();
    }

    window.addEventListener('load', applyDataTableDefaults);
  })();
</script>`)
  );
}

function buildFeatureOverviewBlock(featureStats) {
  const totalTests = featureStats.reduce((sum, feature) => sum + feature.totalTests, 0);
  const topFeature = featureStats[0];
  const rows = featureStats
    .map((feature) => {
      const color = colorForFeature(feature.name);
      return `
                <tr>
                  <td class="text-start fs-6 text-secondary-emphasis summary-row-left-column" style="border-left: 8px solid ${color};">
                    ${escapeHtml(feature.name)}
                  </td>
                  <td class="text-secondary-emphasis">${feature.totalTests}</td>
                  <td class="text-secondary-emphasis">${formatDuration(feature.durationMs)}</td>
                  <td class="result-status-passed">${feature.passed} (<label class="fst-italic">${percentOf(feature.totalTests, feature.passed)}%</label>)</td>
                  <td class="result-status-failed">${feature.failed} (<label class="fst-italic">${percentOf(feature.totalTests, feature.failed)}%</label>)</td>
                  <td class="result-status-timedOut">${feature.timedOut} (<label class="fst-italic">${percentOf(feature.totalTests, feature.timedOut)}%</label>)</td>
                  <td class="result-status-skipped">${feature.skipped} (<label class="fst-italic">${percentOf(feature.totalTests, feature.skipped)}%</label>)</td>
                  <td class="result-status-interrupted">${feature.interrupted} (<label class="fst-italic">${percentOf(feature.totalTests, feature.interrupted)}%</label>)</td>
                  <td class="result-status-flaky">${feature.flaky} (<label class="fst-italic">${percentOf(feature.totalTests, feature.flaky)}%</label>)</td>
                  <td class="text-secondary-emphasis">${percentOf(totalTests, feature.totalTests)}%</td>
                </tr>`;
    })
    .join('\n');

  return `
<div class="mt-3 mb-3 odhin-thin-border dashboard-block" id="odhin-feature-summary">
  <div class="info-box-header">
    Feature Overview
  </div>
  <div class="odhin-table">
    <div class="odhin-feature-overview-layout">
      <div class="odhin-feature-overview-sidebar">
        <div class="odhin-feature-overview-cards">
          <div class="odhin-feature-overview-card">
            <div class="odhin-feature-overview-card-value">${totalTests}</div>
            <div class="odhin-feature-overview-card-label">Tests</div>
          </div>
          <div class="odhin-feature-overview-card">
            <div class="odhin-feature-overview-card-value">${featureStats.length}</div>
            <div class="odhin-feature-overview-card-label">Features</div>
          </div>
        </div>
        <div class="odhin-feature-overview-largest">
          <div class="odhin-feature-overview-largest-title">Largest feature</div>
          <div class="odhin-feature-overview-largest-feature">
            <span style="display:inline-block;width:12px;height:12px;border-radius:999px;background:${colorForFeature(topFeature.name)};"></span>
            <span style="font-size:16px;font-weight:700;">${escapeHtml(topFeature.name)}</span>
          </div>
          <div class="odhin-feature-overview-largest-note">
            ${topFeature.totalTests} tests (${percentOf(totalTests, topFeature.totalTests)}% of this run)
          </div>
        </div>
      </div>
      <div class="odhin-feature-overview-table">
          <div class="table-responsive tableFixHead">
            <table class="table table-sm mb-0">
              <thead>
                <tr>
                  <th class="odhin-text-2 px-2">Feature</th>
                  <th class="odhin-text-2 px-2">Tests</th>
                  <th class="odhin-text-2 px-2">Execution Time</th>
                  <th class="odhin-text-2 px-2">Passed</th>
                  <th class="odhin-text-2 px-2">Failed</th>
                  <th class="odhin-text-2 px-2">Timed Out</th>
                  <th class="odhin-text-2 px-2">Skipped</th>
                  <th class="odhin-text-2 px-2">Interrupted</th>
                  <th class="odhin-text-2 px-2">Flaky</th>
                  <th class="odhin-text-2 px-2">Share of run</th>
                </tr>
              </thead>
              <tbody>
                ${rows || '<tr><td colspan="10" class="text-secondary-emphasis text-start">No grouped features found</td></tr>'}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  </div>
</div>`;
}

function replaceDashboardBlock(root, title, replacementHtml) {
  const block = root
    .querySelectorAll('.dashboard-block')
    .find((candidate) => candidate.querySelector('.info-box-header')?.text.trim() === title);

  if (!block) {
    return false;
  }

  block.replaceWith(parse(replacementHtml));
  return true;
}

function removeDuplicateFeatureStatusBlock(root) {
  const featureStatusBlocks = root
    .querySelectorAll('.dashboard-block')
    .filter((candidate) => candidate.querySelector('.info-box-header')?.text.trim() === 'Status by feature');

  featureStatusBlocks.forEach((candidate) => candidate.remove());
}

function removeLegacyFileChartInitializer(scriptContent) {
  return String(scriptContent)
    .replace(
      /\s*(?:let|const|var)\s+ctxFile\s*=\s*document\.getElementById\('chart-file'\)\.getContext\('2d'\);\s*(?:let|const|var)\s+chartFile\s*=\s*new\s+Chart\(ctxFile,\s*\{[\s\S]*?\}\s*\);\s*/g,
      '\n'
    )
    .replace(/\n{3,}/g, '\n\n');
}

function stripLegacyFileChartArtifacts(root) {
  root.querySelectorAll('#chart-file').forEach((node) => node.remove());
  root.querySelectorAll('script').forEach((scriptNode) => {
    const currentContent = scriptNode.innerHTML;
    const nextContent = removeLegacyFileChartInitializer(currentContent);
    if (nextContent !== currentContent) {
      scriptNode.set_content(nextContent);
    }
  });
}

function isSafeArtifactName(fileName, extension) {
  return typeof fileName === 'string' &&
    /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(fileName) &&
    !fileName.includes('..') && fileName.toLowerCase().endsWith(`.${extension}`);
}

function isRegularFile(folder, fileName) {
  try {
    return fs.lstatSync(path.join(folder, fileName)).isFile();
  } catch {
    return false;
  }
}

function isRegularDirectory(folder) {
  try {
    return fs.lstatSync(folder).isDirectory();
  } catch {
    return false;
  }
}

function readAccessibilityEvidence(outputFolder) {
  const evidenceFolder = path.join(outputFolder, 'accessibility-evidence');
  if (!isRegularDirectory(evidenceFolder)) {
    return [];
  }
  return fs.readdirSync(evidenceFolder)
    .filter((name) => name.startsWith('manifest-entry-') && isSafeArtifactName(name, 'json'))
    .sort()
    .flatMap((manifestName) => {
      if (!isRegularFile(evidenceFolder, manifestName)) {
        return [];
      }
      try {
        const manifest = JSON.parse(fs.readFileSync(path.join(evidenceFolder, manifestName), 'utf8'));
        if (!isSafeArtifactName(manifest.htmlFileName, 'html') ||
            !isSafeArtifactName(manifest.jsonFileName, 'json') ||
            !isRegularFile(evidenceFolder, manifest.htmlFileName) ||
            !isRegularFile(evidenceFolder, manifest.jsonFileName)) {
          return [];
        }
        const detail = JSON.parse(fs.readFileSync(path.join(evidenceFolder, manifest.jsonFileName), 'utf8'));
        const isSummary = manifest.engine === 'summary';
        const violations = Array.isArray(detail.violations) ? detail.violations : [];
        const outcomes = Array.isArray(detail.outcomes) ? detail.outcomes : [];
        if ((!isSummary && !Array.isArray(detail.violations)) || !isNonNegativeInteger(manifest.violationCount) ||
            (!isSummary && manifest.violationCount !== violations.length) ||
            (isSummary && (!Array.isArray(detail.outcomes) || detail.outcomes.length === 0 ||
              !['passed', 'issues-found', 'error'].includes(manifest.status) ||
              detail.outcomes.some((outcome) => !isValidAccessibilityOutcome(outcome)) ||
              manifest.violationCount !== detail.outcomes.reduce(
                (count, outcome) => count + (Number.isInteger(outcome.unexpectedIssueCount) ? outcome.unexpectedIssueCount : outcome.issueCount), 0
              ))) ||
            (!isSummary && detail.violationCount != null && detail.violationCount !== violations.length)) {
          return [];
        }
        const screenshotName = manifest.screenshotFileName;
        const links = [{ label: 'Issue summary', href: `accessibility-evidence/${manifest.htmlFileName}` }];
        if (isSafeArtifactName(screenshotName, 'png') && isRegularFile(evidenceFolder, screenshotName)) {
          links.push({ label: 'Highlighted screenshot', href: `accessibility-evidence/${screenshotName}` });
        }
        const engine = isSummary ? 'Accessibility summary' : String(manifest.engine ?? 'WAVE-like');
        const summaryViolations = isSummary
          ? outcomes.flatMap((outcome) => (outcome.rules ?? []).map((rule) => ({
              rule: `${String(outcome.engine ?? 'accessibility')}: ${String(rule)}`,
              impact: String(outcome.status ?? 'reported'),
              element: 'page state'
            })))
          : violations.map((violation) => ({
              rule: String(violation.rule ?? violation.id ?? 'Unknown rule'),
              impact: String(violation.impact ?? 'reported'),
              element: safeElementTag(violation.codeLocation?.tag ?? violation.nodes?.[0]?.html?.match(/<([a-z][a-z0-9-]*)\b/i)?.[1])
            }));
        return [{
          engine,
          testTitle: String(manifest.testTitle ?? 'Accessibility test'),
          unavailable: manifest.status === 'error',
          violations: summaryViolations,
          links,
        }];
      } catch {
        return [];
      }
    });
}

function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

function isValidAccessibilityOutcome(outcome) {
  return !!outcome &&
    ['axe', 'wave-like', 'screen-reader'].includes(outcome.engine) &&
    ['passed', 'issues-found', 'error'].includes(outcome.status) &&
    isNonNegativeInteger(outcome.issueCount) &&
    (outcome.knownIssueCount == null || isNonNegativeInteger(outcome.knownIssueCount)) &&
    (outcome.unexpectedIssueCount == null ||
      isNonNegativeInteger(outcome.unexpectedIssueCount) && outcome.unexpectedIssueCount <= outcome.issueCount) &&
    Array.isArray(outcome.rules) && outcome.rules.every((rule) => typeof rule === 'string');
}

function safeAxeHelpUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:' || url.hostname !== 'dequeuniversity.com' ||
        !url.pathname.startsWith('/rules/axe/') || url.username || url.password) {
      return null;
    }
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

function extractAxeEvidence(test, result) {
  return (Array.isArray(result?.attachments) ? result.attachments : [])
    .filter((attachment) => attachment?.contentType === 'text/html' &&
      /accessibility report/i.test(attachment.name ?? '') && attachment.body)
    .flatMap((attachment) => {
      const root = parse(Buffer.from(attachment.body).toString('utf8'));
      const cards = root.querySelectorAll('.violationCard');
      const hasHeader = root.querySelector('h1')?.text.includes('Consolidated Accessibility Report');
      if (!hasHeader && !cards.length) {
        return [];
      }
      const pages = root.querySelectorAll('details');
      const incomplete = hasHeader && (!pages.length || pages.some((section) =>
        !/^Page \d+:/.test(section.querySelector('summary')?.text.trim() ?? '') ||
        !section.querySelector('.violationCard') && !section.querySelectorAll('h2').some((heading) =>
          /^axe-core found 0 violations$/i.test(heading.text.trim()))));
      return [{
        engine: 'axe',
        testTitle: String(test?.title ?? attachment.name),
        unavailable: incomplete || cards.length === 0 && !pages.length,
        violations: cards.map((card) => {
          const lines = card.querySelectorAll('.violationCardLine');
          const rule = lines[1]?.querySelector('.card-subtitle')?.text.trim() ?? 'Unknown rule';
          const elementHtml = card.querySelectorAll('pre')
            .map((pre) => parse(pre.innerHTML).querySelector('code.html')?.text)
            .find(Boolean) ?? '';
          return {
            rule,
            impact: lines[2]?.querySelector('.card-subtitle')?.text.trim() ?? 'unknown',
            element: safeElementTag(elementHtml.match(/<([a-z][a-z0-9-]*)\b/i)?.[1]),
            helpUrl: safeAxeHelpUrl(lines[0]?.querySelector('a.learnMore')?.getAttribute('href')),
          };
        }),
        links: [],
      }];
    });
}

function injectAccessibilityTab(root, entries) {
  root.querySelector('#odhin-accessibility-tab')?.remove();
  root.querySelector('#TabAccessibility')?.remove();
  root.querySelector('#odhin-a11y-navigation')?.remove();
  if (!entries.length || !root.querySelector('.tab') || !root.querySelector('body')) {
    return;
  }
  const groups = new Map();
  const cards = entries.map((entry, index) => {
    for (const violation of entry.violations) {
      const key = JSON.stringify([entry.engine, violation.rule]);
      if (!groups.has(key)) groups.set(key, { engine: entry.engine, rule: violation.rule, tests: new Map() });
      groups.get(key).tests.set(index, entry.testTitle);
    }
    const links = entry.links.map(({ label, href }) =>
      `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`).join(' · ');
    const issues = entry.violations.map((violation) => `<li><strong>${escapeHtml(violation.rule)}</strong>${violation.impact ? ` <span>(${escapeHtml(violation.impact)})</span>` : ''}
      <p>Affected element: <code>${escapeHtml(violation.element)}</code></p>
      ${violation.helpUrl ? `<a href="${escapeHtml(violation.helpUrl)}" target="_blank" rel="noopener noreferrer">Rule guidance</a>` : ''}</li>`).join('');
    return `<details id="odhin-a11y-evidence-${index}" class="odhin-a11y-card"><summary>${escapeHtml(entry.engine)} · ${escapeHtml(entry.testTitle)} · ${entry.unavailable ? 'evidence unavailable' : `${entry.violations.length} issue(s)`}</summary>
      <div class="odhin-a11y-body">${links ? `<p>${links}</p>` : ''}
      ${entry.unavailable ? '<p>Evidence unavailable or incomplete; inspect the original Playwright attachment.</p>' : ''}${issues ? `<ul class="odhin-a11y-issues">${issues}</ul>` : entry.unavailable ? '' : '<p>No detected issues in this evidence.</p>'}</div></details>`;
  }).join('');
  const ruleGroups = [...groups.values()]
    .sort((a, b) => b.tests.size - a.tests.size || a.rule.localeCompare(b.rule))
    .map(({ engine, rule, tests }) => `<details class="odhin-a11y-rule-group"><summary><strong>${escapeHtml(engine)} · ${escapeHtml(rule)}</strong><span>${tests.size} evidence record${tests.size === 1 ? '' : 's'}</span></summary>
      <ul>${[...tests].map(([index, title]) => `<li><a class="odhin-a11y-evidence-jump" href="#odhin-a11y-evidence-${index}">${escapeHtml(title)}</a></li>`).join('')}</ul></details>`).join('');
  root.querySelector('.tab').insertAdjacentHTML('beforeend',
    '<button type="button" id="odhin-accessibility-tab" class="main-tablinks" aria-controls="TabAccessibility" onclick="openMainTab(event, \'TabAccessibility\')">Accessibility evidence</button>');
  root.querySelector('body').insertAdjacentHTML('beforeend',
    `<section id="TabAccessibility" class="main-tabcontent" style="display: none" aria-labelledby="odhin-accessibility-tab"><div class="container-fluid mt-3 mb-5"><h2>Accessibility evidence</h2><p class="odhin-a11y-intro">Review rules and affected element types here. Detailed selectors remain in the original test evidence. Results do not change the accessibility lane policy.</p><h3>Rules across tests</h3><label for="odhin-a11y-rule-search">Search rules and affected tests</label><input id="odhin-a11y-rule-search" class="odhin-a11y-rule-search" type="search" aria-controls="odhin-a11y-rule-groups"><p id="odhin-a11y-filter-status" role="status" aria-live="polite"></p><div id="odhin-a11y-rule-groups">${ruleGroups || '<p>No rule findings recorded in this evidence.</p>'}</div><p id="odhin-a11y-no-match" hidden>No matching rules or tests.</p><h3>Evidence by test</h3>${cards}</div></section>`);
  root.querySelector('body').insertAdjacentHTML('beforeend', `<script id="odhin-a11y-navigation">
    (() => {
      const tab = document.querySelector('#TabAccessibility');
      const search = tab.querySelector('#odhin-a11y-rule-search');
      const groups = [...tab.querySelectorAll('.odhin-a11y-rule-group')];
      const status = tab.querySelector('#odhin-a11y-filter-status');
      const update = () => {
        const query = search.value.trim().toLowerCase();
        let visible = 0;
        groups.forEach((group) => {
          group.hidden = !group.textContent.toLowerCase().includes(query);
          if (!group.hidden) visible++;
        });
        status.textContent = visible + ' of ' + groups.length + ' rule groups match';
        tab.querySelector('#odhin-a11y-no-match').hidden = visible > 0 || !query;
      };
      search.addEventListener('input', update);
      tab.addEventListener('click', (event) => {
        const link = event.target.closest('.odhin-a11y-evidence-jump');
        if (!link) return;
        event.preventDefault();
        const card = tab.querySelector(link.getAttribute('href'));
        card.open = true;
        card.querySelector('summary').focus();
        card.scrollIntoView({ block: 'center' });
      });
      update();
    })();
  </script>`);
}

function enhanceDashboardHtml(html, featureStats, perfettoFiles = [], perfettoHrefPrefix = '../test-results', accessibilityEntries = [], testMetadata = []) {
  const normalizedStats = normalizeFeatureStats(featureStats);
  const root = parse(html);

  injectEnhancerStyles(root);
  injectDataTableDefaults(root);

  if (normalizedStats.length) {
    replaceDashboardBlock(root, 'Files Summary', buildFeatureOverviewBlock(normalizedStats));
    removeDuplicateFeatureStatusBlock(root);

    stripLegacyFileChartArtifacts(root);
  }

  if (perfettoFiles.length) {
    injectPerfettoTab(root, perfettoFiles, perfettoHrefPrefix);
  }

  injectAccessibilityTab(root, accessibilityEntries);
  applyPresentation(root, testMetadata);

  return root.toString();
}

function injectPerfettoTab(root, perfettoFiles, perfettoHrefPrefix = '../test-results') {
  root.querySelector('#odhin-perfetto-link')?.remove();
  root.querySelector('#TabPerfetto')?.remove();
  root.querySelector('.main-tablinks[onclick*="TabPerfetto"]')?.remove();

  const safePrefix = safePerfettoHrefPrefix(perfettoHrefPrefix);
  const links = safePrefix
    ? perfettoFiles.filter((name) => /^perfetto(?:[-_][A-Za-z0-9._-]+)?\.json$/i.test(name) && !name.includes('..'))
      .map((fileName) => `<a href="${escapeHtml(`${safePrefix}/${fileName}`)}" target="_blank" rel="noopener noreferrer">${escapeHtml(fileName)}</a>`).join(' · ')
    : '';
  if (!links) {
    return;
  }
  root
    .querySelector('.tab')
    ?.insertAdjacentHTML(
      'beforeend',
      `<button class="main-tablinks" onclick="openMainTab(event, 'TabPerfetto')">Perfetto Results</button>`
    );
  root
    .querySelector('body')
    ?.insertAdjacentHTML(
      'beforeend',
      `<div id="TabPerfetto" style="display: none" class="main-tabcontent"><div class="container-fluid text-center mt-3 mb-5"><div class="row ms-3 me-3"><div class="col-12"><div class="mt-3 mb-3 odhin-thin-border dashboard-block"><div class="info-box-header">Perfetto Results</div><p class="text-secondary-emphasis small mb-3 ps-4">Suite timeline with test names and statuses.</p><p id="odhin-perfetto-link">${links}</p></div></div></div></div></div>`
    );
}

function safePerfettoHrefPrefix(rawPrefix) {
  if (rawPrefix === 'test-results' || rawPrefix === '../test-results') {
    return rawPrefix;
  }
  try {
    const url = new URL(rawPrefix);
    if (!['https:', 'http:'].includes(url.protocol)) {
      return null;
    }
    url.username = '';
    url.password = '';
    url.search = '';
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

function enhanceGeneratedReport(outputFolder, featureStats, axeEvidence = [], testMetadata = [], { indexFilename, startedAtMs } = {}) {
  if (!outputFolder || !fs.existsSync(outputFolder)) {
    throw new Error('Odhín report output folder is missing');
  }

  const reportFiles = fs.readdirSync(outputFolder).filter((fileName) => fileName.toLowerCase().endsWith('.html'));
  if (!reportFiles.length || (indexFilename && !reportFiles.includes(indexFilename))) {
    throw new Error(`Odhín report index is missing${indexFilename ? `: ${indexFilename}` : ''}`);
  }
  const reportPath = path.join(outputFolder, indexFilename || reportFiles[0]);
  const reportTimestampToleranceMs = 1000;
  // CI filesystems can expose report mtimes at one-second precision; keep the stale guard without rejecting a report written during finalisation.
  if (startedAtMs && fs.statSync(reportPath).mtimeMs + reportTimestampToleranceMs < startedAtMs) {
    throw new Error('Odhín report index is stale');
  }
  if (indexFilename) {
    const html = fs.readFileSync(reportPath, 'utf8');
    const root = parse(html);
    if (!/<\/html>\s*$/i.test(html) || !root.querySelector('body#body-content') || !root.querySelector('#TabDashboard') ||
      !root.querySelector('#TabTests') || !root.querySelector('#test-list-table')) {
      throw new Error('Odhín report index is incomplete');
    }
  }

  const accessibilityEntries = dedupeAccessibilityEntries([
    ...readAccessibilityEvidence(outputFolder),
    ...axeEvidence,
  ]);
  reportFiles.forEach((fileName) => {
    const filePath = path.join(outputFolder, fileName);
    const currentHtml = fs.readFileSync(filePath, 'utf8');
    const testResultsFolder = [path.join(outputFolder, 'test-results'), path.join(outputFolder, '..', 'test-results')].find(
      (folder) => fs.existsSync(folder)
    );
    const perfettoFiles =
      testResultsFolder && fs.existsSync(testResultsFolder)
        ? fs.readdirSync(testResultsFolder).filter((name) => /^perfetto(?:[-_].*)?\.json$/i.test(name))
        : [];
    const perfettoHrefPrefix = resolvePerfettoHrefPrefix(outputFolder, testResultsFolder);
    const nextHtml = enhanceDashboardHtml(currentHtml, featureStats, perfettoFiles, perfettoHrefPrefix, accessibilityEntries, testMetadata);
    fs.writeFileSync(filePath, nextHtml, 'utf8');
  });
}

function dedupeAccessibilityEntries(entries) {
  const unique = new Map();
  for (const entry of entries) {
    const key = `${String(entry.engine)}\u0000${String(entry.testTitle)}\u0000${String(entry.feature ?? '')}\u0000${String(entry.pageState ?? '')}\u0000${(entry.violations ?? [])
      .map((violation) => violation.rule)
      .sort()
      .join(',')}`;
    if (!unique.has(key)) {
      unique.set(key, entry);
    }
  }
  return [...unique.values()];
}

function resolvePerfettoHrefPrefix(outputFolder, testResultsFolder, env = process.env) {
  const artifactBaseUrl = (env.PLAYWRIGHT_PERFETTO_ARTIFACT_BASE_URL || env.BUILD_URL)?.trim().replace(/\/$/, '');
  if (artifactBaseUrl && testResultsFolder) {
    const relativeResultsPath = path.relative(process.cwd(), testResultsFolder).split(path.sep).join('/');
    return `${artifactBaseUrl}/artifact/${relativeResultsPath}`;
  }
  return testResultsFolder === path.join(outputFolder, 'test-results') ? 'test-results' : '../test-results';
}

module.exports = {
  createEmptyFeatureStat,
  deriveFeatureName,
  enhanceDashboardHtml,
  enhanceGeneratedReport,
  extractAxeEvidence,
  formatDuration,
  normalizeFeatureStats,
  percentOf,
  __test__: {
    buildFeatureOverviewBlock,
    createEmptyFeatureStat,
    deriveFeatureName,
    enhanceDashboardHtml,
    formatDuration,
    injectDataTableDefaults,
    removeLegacyFileChartInitializer,
    normalizeFeatureStats,
    percentOf,
    resolvePerfettoHrefPrefix,
    injectPerfettoTab,
    readAccessibilityEvidence,
    dedupeAccessibilityEntries,
  },
};
