import type { Page, TestInfo } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';

export const WAVE_LIKE_A11Y_TAG = '@wave-a11y';

export type WaveLikeViolation = {
  rule: string;
  message: string;
  advice?: string;
  selector?: string;
  html?: string;
  codeLocation?: {
    tag: string;
    id?: string;
    classes?: string;
    role?: string;
    testId?: string;
    angularAttrs?: string;
    accessibleName?: string;
    nearestHeading?: string;
    nearestLandmark?: string;
  };
};

type PublishedEvidenceEntry = {
  testTitle: string;
  attachmentPrefix: string;
  htmlFileName: string;
  jsonFileName: string;
  screenshotFileName: string;
  violationCount: number;
  rules: string[];
  targets: string[];
};

const EVIDENCE_ENTRY_PREFIX = 'manifest-entry-';

export async function collectWaveLikeAccessibilityViolations(page: Page): Promise<WaveLikeViolation[]> {
  return page.evaluate<WaveLikeViolation[]>(() => {
    const visible = (element: Element): element is HTMLElement => {
      if (!(element instanceof HTMLElement)) {
        return false;
      }
      if (element.hidden || element.getAttribute('aria-hidden') === 'true') {
        return false;
      }
      if (element instanceof HTMLInputElement && element.type === 'hidden') {
        return false;
      }
      const style = window.getComputedStyle(element);
      return style.visibility !== 'hidden' && style.display !== 'none' && element.getClientRects().length > 0;
    };

    const text = (element: Element | null): string => element?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    const selectorFor = (element: Element): string => {
      const id = element.getAttribute('id');
      if (id) {
        return `#${id}`;
      }
      const testId = element.getAttribute('data-testid') ?? element.getAttribute('data-test-id');
      if (testId) {
        return `[data-testid="${testId}"]`;
      }
      return element.tagName.toLowerCase();
    };
    const htmlFor = (element: Element): string => element.outerHTML.slice(0, 500);
    const labelledByText = (element: Element): string =>
      (element.getAttribute('aria-labelledby') ?? '')
        .split(/\s+/)
        .filter(Boolean)
        .map((id) => text(document.getElementById(id)))
        .filter(Boolean)
        .join(' ');
    const controlLabels = (element: Element): string => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLButtonElement ||
        element instanceof HTMLOutputElement
      ) {
        return Array.from(element.labels ?? [])
          .map((label) => text(label))
          .filter(Boolean)
          .join(' ');
      }
      const id = element.getAttribute('id');
      if (!id) {
        return '';
      }
      return Array.from(document.querySelectorAll(`label[for="${CSS.escape(id)}"]`))
        .map((label) => text(label))
        .filter(Boolean)
        .join(' ');
    };
    const accessibleName = (element: Element): string => {
      const ariaLabel = element.getAttribute('aria-label')?.trim() ?? '';
      const labelledBy = labelledByText(element);
      const labelText = controlLabels(element);
      const title = element.getAttribute('title')?.trim() ?? '';
      const placeholder = element.getAttribute('placeholder')?.trim() ?? '';
      const value =
        element instanceof HTMLInputElement && ['button', 'submit', 'reset'].includes(element.type) ? element.value.trim() : '';
      const imageAlt = Array.from(element.querySelectorAll('img'))
        .map((image) => image.getAttribute('alt')?.trim() ?? '')
        .filter(Boolean)
        .join(' ');
      return [ariaLabel, labelledBy, labelText, title, placeholder, value, imageAlt, text(element)]
        .filter(Boolean)
        .join(' ')
        .trim();
    };
    const nearestHeading = (element: Element): string => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter(visible);
      const previousHeading = headings
        .reverse()
        .find((heading) => Boolean(heading.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING));
      return previousHeading ? `${previousHeading.tagName.toLowerCase()}: ${text(previousHeading)}` : '';
    };
    const nearestLandmark = (element: Element): string => {
      const landmark = element.closest(
        'main, nav, header, footer, aside, [role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"]'
      );
      if (!landmark) {
        return '';
      }
      const role = landmark.getAttribute('role');
      const id = landmark.getAttribute('id');
      const classes = landmark.getAttribute('class');
      return [
        landmark.tagName.toLowerCase(),
        role ? `role=${role}` : '',
        id ? `#${id}` : '',
        classes ? `.${classes.split(/\s+/).filter(Boolean).join('.')}` : ''
      ]
        .filter(Boolean)
        .join(' ');
    };
    const codeLocationFor = (element: Element): WaveLikeViolation['codeLocation'] => {
      const angularAttrs = Array.from(element.attributes)
        .map((attribute) => attribute.name)
        .filter((name) => name.startsWith('_ng') || name.startsWith('ng-reflect-'))
        .join(' ');

      return {
        tag: element.tagName.toLowerCase(),
        ...(element.id ? { id: element.id } : {}),
        ...(element.className && typeof element.className === 'string' ? { classes: element.className } : {}),
        ...(element.getAttribute('role') ? { role: element.getAttribute('role') ?? '' } : {}),
        ...(element.getAttribute('data-testid') || element.getAttribute('data-test-id')
          ? { testId: element.getAttribute('data-testid') ?? element.getAttribute('data-test-id') ?? '' }
          : {}),
        ...(angularAttrs ? { angularAttrs } : {}),
        ...(accessibleName(element) ? { accessibleName: accessibleName(element).slice(0, 160) } : {}),
        ...(nearestHeading(element) ? { nearestHeading: nearestHeading(element).slice(0, 160) } : {}),
        ...(nearestLandmark(element) ? { nearestLandmark: nearestLandmark(element).slice(0, 160) } : {})
      };
    };
    const add = (violations: WaveLikeViolation[], rule: string, message: string, element?: Element) => {
      violations.push({
        rule,
        message,
        ...(element ? { selector: selectorFor(element), html: htmlFor(element), codeLocation: codeLocationFor(element) } : {})
      });
    };

    const violations: WaveLikeViolation[] = [];

    if (!document.documentElement.getAttribute('lang')?.trim()) {
      add(violations, 'document-language', 'The html element should declare a lang attribute.');
    }

    const title = document.title.trim();
    if (!title || /^untitled$/i.test(title)) {
      add(violations, 'document-title', 'The page should have a meaningful document title.');
    }

    const mainLandmarks = Array.from(document.querySelectorAll('main, [role="main"]')).filter(visible);
    if (mainLandmarks.length !== 1) {
      add(violations, 'main-landmark', `Expected exactly one visible main landmark, found ${mainLandmarks.length}.`);
    }

    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter(visible);
    const h1s = headings.filter((heading) => heading.tagName.toLowerCase() === 'h1');
    if (h1s.length !== 1) {
      add(violations, 'h1-count', `Expected exactly one visible h1, found ${h1s.length}.`, h1s[0]);
    }
    headings.reduce((previousLevel, heading) => {
      const level = Number(heading.tagName.slice(1));
      if (previousLevel > 0 && level > previousLevel + 1) {
        add(violations, 'heading-order', `Heading level jumps from h${previousLevel} to h${level}.`, heading);
      }
      return level;
    }, 0);

    const ids = new Map<string, Element[]>();
    document.querySelectorAll('[id]').forEach((element) => {
      const id = element.getAttribute('id') ?? '';
      ids.set(id, [...(ids.get(id) ?? []), element]);
    });
    ids.forEach((elements, id) => {
      if (id && elements.length > 1) {
        add(violations, 'duplicate-id', `Duplicate id "${id}" appears ${elements.length} times.`, elements[0]);
      }
    });

    Array.from(document.querySelectorAll('a[href], button, input, select, textarea, [role="button"], [role="link"]'))
      .filter(visible)
      .filter((element) => !accessibleName(element))
      .forEach((element) =>
        add(violations, 'accessible-name', 'Interactive controls and links should expose an accessible name.', element)
      );

    Array.from(document.querySelectorAll('img'))
      .filter(visible)
      .filter((image) => {
        const role = image.getAttribute('role')?.trim().toLowerCase() ?? '';
        return role !== 'presentation' && role !== 'none' && image.getAttribute('alt') === null;
      })
      .forEach((image) => add(violations, 'image-alt', 'Images should have alt text or be marked decorative.', image));

    Array.from(document.querySelectorAll('fieldset'))
      .filter(visible)
      .filter((fieldset) => !text(fieldset.querySelector('legend')))
      .forEach((fieldset) =>
        add(violations, 'fieldset-legend', 'Fieldsets should expose a visible legend for grouped controls.', fieldset)
      );

    Array.from(document.querySelectorAll('table'))
      .filter(visible)
      .filter((table) => table.querySelectorAll('td').length > 0)
      .filter((table) => table.querySelectorAll('th, [role="columnheader"], [role="rowheader"]').length === 0)
      .forEach((table) => add(violations, 'table-headers', 'Data tables should expose row or column headers.', table));

    Array.from(document.querySelectorAll('.govuk-error-summary a[href]')).forEach((link) => {
      const href = link.getAttribute('href') ?? '';
      if (!href.startsWith('#')) {
        add(violations, 'error-summary-target', 'Error summary links should target controls on the same page.', link);
        return;
      }
      if (!document.getElementById(decodeURIComponent(href.slice(1)))) {
        add(violations, 'error-summary-target', `Error summary link target "${href}" does not exist.`, link);
      }
    });

    return violations;
  });
}

export async function attachWaveLikeAccessibilityEvidence(
  page: Page,
  testInfo: TestInfo | undefined,
  violations: WaveLikeViolation[],
  attachmentPrefix = 'wave-accessibility-issues'
): Promise<void> {
  if (!testInfo) {
    return;
  }

  const evidencedViolations = withDeveloperAdvice(violations);
  const summary = { url: page.url(), violationCount: evidencedViolations.length, violations: evidencedViolations };
  await testInfo.attach(`${attachmentPrefix}.json`, {
    body: JSON.stringify(summary, null, 2),
    contentType: 'application/json'
  });
  await testInfo.attach(`${attachmentPrefix}.html`, {
    body: buildIssueSummaryHtml(page.url(), evidencedViolations),
    contentType: 'text/html'
  });

  const cleanup = evidencedViolations.length > 0 ? await markViolationsOnPage(page, evidencedViolations) : async () => {};
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

  await writePublishedEvidence(testInfo, page.url(), evidencedViolations, screenshot, attachmentPrefix);
}

function buildIssueSummaryHtml(url: string, violations: WaveLikeViolation[]): string {
  const hasViolations = violations.length > 0;
  const cards = violations
    .map(
      (violation, index) => `
        <section class="issue">
          <h2>${index + 1}. ${escapeHtml(violation.rule)}</h2>
          <p><strong>${escapeHtml(violation.message)}</strong></p>
          <p><strong>Selector:</strong> <code>${escapeHtml(violation.selector ?? 'page')}</code></p>
          ${buildDeveloperAdviceHtml(url, violation)}
          <pre>${escapeHtml(violation.html ?? '')}</pre>
        </section>
      `
    )
    .join('');

  return `
    <html>
      <head>
        <title>WAVE-like Accessibility Issues</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #0b0c0c; }
          .banner { background: ${hasViolations ? '#d4351c' : '#00703c'}; color: #fff; padding: 16px; margin-bottom: 24px; }
          .issue { border: 4px solid #d4351c; padding: 16px; margin-bottom: 18px; }
          .issue h2 { margin-top: 0; }
          .advice { background: #f3f2f1; border-left: 8px solid #1d70b8; padding: 12px 16px; margin: 12px 0; }
          .advice dt { font-weight: bold; margin-top: 8px; }
          .advice dd { margin-left: 0; }
          code, pre { background: #f3f2f1; padding: 4px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <div class="banner">
          <h1>${hasViolations ? 'WAVE-LIKE ACCESSIBILITY ISSUES FOUND' : 'NO WAVE-LIKE ACCESSIBILITY ISSUES FOUND'}</h1>
          <p>${violations.length} issue(s) on ${escapeHtml(url)}.${hasViolations ? ' Match marker numbers here to the highlighted screenshot.' : ' Screenshot captured for page-state evidence.'}</p>
        </div>
        ${cards}
      </body>
    </html>
  `;
}

function withDeveloperAdvice(violations: WaveLikeViolation[]): WaveLikeViolation[] {
  return violations.map((violation) => ({
    ...violation,
    advice: violation.advice ?? adviceForRule(violation.rule)
  }));
}

function buildDeveloperAdviceHtml(url: string, violation: WaveLikeViolation): string {
  return `
    <div class="advice">
      <h3>Developer advice</h3>
      <dl>
        <dt>Where to look</dt>
        <dd>${buildWhereToLookHtml(url, violation)}</dd>
        <dt>What failed</dt>
        <dd>${escapeHtml(violation.rule)}: ${escapeHtml(violation.message)}</dd>
        <dt>What to fix</dt>
        <dd>${escapeHtml(violation.advice ?? adviceForRule(violation.rule))}</dd>
        <dt>Evidence</dt>
        <dd>Use this DOM snippet with the numbered highlighted screenshot marker for the same issue.</dd>
      </dl>
    </div>
  `;
}

function buildWhereToLookHtml(url: string, violation: WaveLikeViolation): string {
  const hint = violation.codeLocation;
  if (!hint) {
    return `Route/page: <code>${escapeHtml(url)}</code>; page-level issue, inspect the document shell/template.`;
  }

  const parts = [
    `route/page: ${url}`,
    `tag: ${hint.tag}`,
    hint.id ? `id: #${hint.id}` : '',
    hint.classes ? `class: ${hint.classes}` : '',
    hint.role ? `role: ${hint.role}` : '',
    hint.testId ? `test id: ${hint.testId}` : '',
    hint.angularAttrs ? `angular: ${hint.angularAttrs}` : '',
    hint.nearestHeading ? `near: ${hint.nearestHeading}` : '',
    hint.nearestLandmark ? `landmark: ${hint.nearestLandmark}` : '',
    hint.accessibleName ? `name: ${hint.accessibleName}` : ''
  ].filter(Boolean);

  return `<code>${escapeHtml(parts.join(' | '))}</code>`;
}

function adviceForRule(rule: string): string {
  const adviceByRule: Record<string, string> = {
    'accessible-name': 'Add visible text, a label, aria-label, or aria-labelledby so the control has an accessible name.',
    'document-language': 'Add a lang attribute to the html element.',
    'document-title': 'Set a meaningful page title for the current route/state.',
    'duplicate-id': 'Make the id unique, then update any labels, error links, and aria references that point at it.',
    'error-summary-target': 'Point the error-summary link at the invalid field id and ensure focus moves to the summary.',
    'fieldset-legend': 'Add a visible legend that describes the grouped controls.',
    'h1-count': 'Keep exactly one visible h1 for the page state.',
    'heading-order': 'Change the heading level or add the missing section heading so levels do not jump.',
    'image-alt': 'Add useful alt text, or mark decorative images with empty alt text or role="presentation".',
    'main-landmark': 'Ensure the rendered page has exactly one usable main element or role="main".',
    'table-headers': 'Add th elements or row/column header roles for data tables.'
  };
  return adviceByRule[rule] ?? 'Inspect the selector and DOM snippet, then apply the relevant GOV.UK accessibility pattern.';
}

async function markViolationsOnPage(page: Page, violations: WaveLikeViolation[]): Promise<() => Promise<void>> {
  await page.evaluate(
    (items) => {
      const overlayRoot = document.createElement('div');
      overlayRoot.setAttribute('data-testid', 'wave-violation-overlays');
      overlayRoot.style.position = 'absolute';
      overlayRoot.style.left = '0';
      overlayRoot.style.top = '0';
      overlayRoot.style.width = '0';
      overlayRoot.style.height = '0';
      overlayRoot.style.zIndex = '2147483647';
      overlayRoot.style.pointerEvents = 'none';
      document.body.appendChild(overlayRoot);

      for (const item of items) {
        if (!item.selector) {
          continue;
        }
        let element: Element | null = null;
        try {
          element = document.querySelector(item.selector);
        } catch {
          element = null;
        }
        if (!element) {
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
        label.textContent = `${item.index + 1} ${item.rule}`;
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
    },
    violations.map((violation, index) => ({ ...violation, index }))
  );

  return async () => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="wave-violation-overlays"]')?.remove();
    });
  };
}

async function writePublishedEvidence(
  testInfo: TestInfo,
  url: string,
  violations: WaveLikeViolation[],
  screenshot: Buffer,
  attachmentPrefix: string
): Promise<void> {
  const evidenceDir = path.resolve(
    process.env.PW_A11Y_EVIDENCE_DIR ||
      path.join(
        process.env.PLAYWRIGHT_REPORT_FOLDER || 'functional-output/tests/playwright-wave-a11y/odhin-report',
        'accessibility-evidence'
      )
  );
  const safeTitle = sanitiseFileName(testInfo.title);
  const baseName = `${safeTitle}-${attachmentPrefix}`;
  const htmlFileName = `${baseName}.html`;
  const jsonFileName = `${baseName}.json`;
  const screenshotFileName = `${baseName}-highlighted-screenshot.png`;
  const entry: PublishedEvidenceEntry = {
    testTitle: testInfo.title,
    attachmentPrefix,
    htmlFileName,
    jsonFileName,
    screenshotFileName,
    violationCount: violations.length,
    rules: violations.map((violation) => violation.rule),
    targets: violations.map((violation) => violation.selector ?? url)
  };

  await fs.mkdir(evidenceDir, { recursive: true });
  await fs.writeFile(path.join(evidenceDir, htmlFileName), buildIssueSummaryHtml(url, violations));
  await fs.writeFile(
    path.join(evidenceDir, jsonFileName),
    JSON.stringify({ url, violationCount: violations.length, violations }, null, 2)
  );
  await fs.writeFile(path.join(evidenceDir, screenshotFileName), screenshot);
  await writeEvidenceEntry(evidenceDir, baseName, entry);
}

async function writeEvidenceEntry(evidenceDir: string, baseName: string, entry: PublishedEvidenceEntry): Promise<void> {
  await fs.writeFile(path.join(evidenceDir, `${EVIDENCE_ENTRY_PREFIX}${baseName}.json`), JSON.stringify(entry, null, 2));
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function sanitiseFileName(value: string): string {
  return (
    value
      .replace(/[^a-z0-9._-]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 120) || 'wave-accessibility'
  );
}
