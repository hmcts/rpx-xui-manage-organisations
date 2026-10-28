import { AxeBuilder } from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';
import type { AxeResults, Result } from 'axe-core';
import { escapeAttribute, escapeHtml, publishAccessibilityEvidence, sanitiseMarkup } from './accessibilityEvidencePublisher';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];

interface AuditOptions {
  exclude?: string | string[];
  include?: string | string[];
  disableRules?: string | string[];
}

interface PublishedEvidenceMetadata {
  engine: 'axe';
  feature: string;
  pageState: string;
}

const normaliseArray = <T>(value?: T | T[]): T[] => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

export async function runAxeAudit(page: Page, options?: AuditOptions): Promise<AxeResults> {
  const builder = new AxeBuilder({
    page: page as unknown as import('playwright-core').Page
  }).withTags(WCAG_TAGS);

  for (const selector of normaliseArray(options?.exclude)) {
    builder.exclude(selector);
  }

  for (const selector of normaliseArray(options?.include)) {
    builder.include(selector);
  }

  const disabledRules = normaliseArray(options?.disableRules);
  if (disabledRules.length > 0) {
    builder.disableRules(disabledRules);
  }

  return builder.analyze();
}

export async function attachAccessibilityEvidence(
  page: Page,
  testInfo: TestInfo | undefined,
  results: AxeResults,
  attachmentPrefix = 'accessibility-issues',
  metadata?: PublishedEvidenceMetadata
): Promise<void> {
  if (!testInfo || results.violations.length === 0) {
    return;
  }

  await testInfo.attach(`${attachmentPrefix}.json`, {
    body: JSON.stringify(toEvidenceSummary(results), null, 2),
    contentType: 'application/json'
  });

  await testInfo.attach(`${attachmentPrefix}.html`, {
    body: buildIssueSummaryHtml(results),
    contentType: 'text/html'
  });

  const cleanup = await markViolationsOnPage(page, results.violations);
  let screenshot: Buffer;
  try {
    screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach(`${attachmentPrefix}-highlighted-screenshot.png`, {
      body: screenshot,
      contentType: 'image/png'
    });
  } finally {
    await cleanup();
  }

  await writePublishedEvidence(testInfo, results, screenshot, attachmentPrefix, metadata);
}

function toEvidenceSummary(results: AxeResults): unknown {
  return {
    url: results.url,
    violationCount: results.violations.length,
    violations: results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      description: violation.description,
      helpUrl: violation.helpUrl,
      tags: violation.tags,
      nodes: violation.nodes.map((node) => ({
        target: node.target.map(() => '[element selector]'),
        failureSummary: node.failureSummary,
        html: sanitiseMarkup(node.html)
      }))
    }))
  };
}

function buildIssueSummaryHtml(results: AxeResults): string {
  const cards = results.violations
    .map((violation, violationIndex) => {
      const nodes = violation.nodes
        .map(
          (node, nodeIndex) => `
            <li>
              <p><strong>Marker:</strong> ${violationIndex + 1}.${nodeIndex + 1}</p>
              <p><strong>Selector:</strong> <code>[element selector]</code></p>
              <p><strong>Failure:</strong> ${escapeHtml(node.failureSummary ?? 'No failure summary provided')}</p>
              <pre>${escapeHtml(sanitiseMarkup(node.html))}</pre>
            </li>
          `
        )
        .join('');

      return `
        <section class="issue">
          <h2>${violationIndex + 1}. ${escapeHtml(violation.id)} <span>${escapeHtml(
  violation.impact ?? 'unknown impact'
)}</span></h2>
          <p><strong>${escapeHtml(violation.help)}</strong></p>
          <p>${escapeHtml(violation.description)}</p>
          <p><a href="${escapeAttribute(violation.helpUrl)}">${escapeHtml(violation.helpUrl)}</a></p>
          <ol>${nodes}</ol>
        </section>
      `;
    })
    .join('');

  return `
    <html>
      <head>
        <title>Accessibility Issues</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #0b0c0c; }
          .banner { background: #d4351c; color: #fff; padding: 16px; margin-bottom: 24px; }
          .issue { border: 4px solid #d4351c; padding: 16px; margin-bottom: 18px; }
          .issue h2 { margin-top: 0; }
          .issue h2 span { background: #ffdd00; color: #0b0c0c; font-size: 16px; padding: 4px 8px; }
          code, pre { background: #f3f2f1; padding: 4px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <div class="banner">
          <h1>ACCESSIBILITY ISSUES FOUND</h1>
          <p>${results.violations.length} axe rule violation(s). Match marker numbers here to the highlighted screenshot.</p>
        </div>
        ${cards}
      </body>
    </html>
  `;
}

async function writePublishedEvidence(
  testInfo: TestInfo,
  results: AxeResults,
  screenshot: Buffer,
  attachmentPrefix: string,
  metadata?: PublishedEvidenceMetadata
): Promise<void> {
  await publishAccessibilityEvidence(testInfo, {
    attachmentPrefix,
    entry: {
      engine: 'axe',
      feature: metadata?.feature,
      pageState: metadata?.pageState,
      violationCount: results.violations.length,
      rules: results.violations.map((violation) => violation.id),
      targets: results.violations.flatMap((violation) =>
        violation.nodes.flatMap((node) => node.target.map(() => '[element selector]'))
      )
    },
    html: buildIssueSummaryHtml(results),
    json: toEvidenceSummary(results),
    screenshot,
    screenshotSuffix: '-highlighted-screenshot.png'
  });
}

async function markViolationsOnPage(page: Page, violations: Result[]): Promise<() => Promise<void>> {
  const markers = violations.flatMap((violation, violationIndex) =>
    violation.nodes.flatMap((node, nodeIndex) =>
      node.target
        .filter((target): target is string => typeof target === 'string')
        .map((target) => ({
          target,
          label: `${violationIndex + 1}.${nodeIndex + 1}`,
          rule: violation.id
        }))
    )
  );

  await page.evaluate((items) => {
    const overlayRoot = document.createElement('div');
    overlayRoot.setAttribute('data-testid', 'axe-violation-overlays');
    overlayRoot.style.position = 'absolute';
    overlayRoot.style.left = '0';
    overlayRoot.style.top = '0';
    overlayRoot.style.width = '0';
    overlayRoot.style.height = '0';
    overlayRoot.style.zIndex = '2147483647';
    overlayRoot.style.pointerEvents = 'none';
    document.body.appendChild(overlayRoot);

    const unresolved: Array<{ label: string; rule: string; target: string }> = [];

    for (const item of items) {
      let element: Element | null = null;
      try {
        element = document.querySelector(item.target);
      } catch {
        element = null;
      }

      if (!element) {
        unresolved.push(item);
        continue;
      }

      const rect = element.getBoundingClientRect();
      const marker = document.createElement('div');
      marker.style.position = 'absolute';
      marker.style.left = `${rect.left + window.scrollX}px`;
      marker.style.top = `${rect.top + window.scrollY}px`;
      marker.style.width = `${Math.max(rect.width, 2)}px`;
      marker.style.height = `${Math.max(rect.height, 2)}px`;
      marker.style.outline = '6px solid #d4351c';
      marker.style.background = 'rgba(255, 221, 0, 0.24)';
      marker.style.boxSizing = 'border-box';

      const label = document.createElement('div');
      label.textContent = `${item.label} ${item.rule}`;
      label.style.position = 'absolute';
      label.style.left = '0';
      label.style.top = '-32px';
      label.style.background = '#d4351c';
      label.style.color = '#fff';
      label.style.font = 'bold 16px Arial, sans-serif';
      label.style.padding = '4px 8px';
      label.style.whiteSpace = 'nowrap';

      marker.appendChild(label);
      overlayRoot.appendChild(marker);
    }

    if (unresolved.length > 0) {
      const banner = document.createElement('div');
      banner.style.position = 'absolute';
      banner.style.left = `${window.scrollX + 16}px`;
      banner.style.top = `${window.scrollY + 16}px`;
      banner.style.maxWidth = '760px';
      banner.style.background = '#d4351c';
      banner.style.color = '#fff';
      banner.style.border = '6px solid #ffdd00';
      banner.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.35)';
      banner.style.font = 'bold 18px Arial, sans-serif';
      banner.style.padding = '12px 16px';
      banner.textContent = `Page-level axe finding(s): ${unresolved
        .slice(0, 5)
        .map((item) => `${item.label} ${item.rule} (${item.target})`)
        .join('; ')}${unresolved.length > 5 ? '; ...' : ''}`;
      overlayRoot.appendChild(banner);
    }
  }, markers);

  return async () => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="axe-violation-overlays"]')?.remove();
    });
  };
}
