import { expect, test } from '@playwright/test';
import { createRequire } from 'node:module';
import { parse } from 'node-html-parser';

const require = createRequire(__filename);
const { enhanceDashboardHtml } = require('../../common/reporters/odhin-report-enhancer.cjs');
const native = `<html><head></head><body id="body-content"><div class="tab"></div><section id="TabDashboard"></section>
  <script>function openMainTab(event, id) { document.getElementById(id).style.display = 'block'; }</script></body></html>`;
const entries = [
  { engine: 'axe', testTitle: 'Organisation details', violations: [{ rule: 'button-name', impact: 'critical', element: 'button', selector: '#private-avery@example.com' }], links: [] },
  { engine: 'axe', testTitle: 'PBA details', violations: [{ rule: 'button-name', impact: 'serious', element: 'button', selector: '#case-123456789' }], links: [] },
  { engine: 'wave-like', testTitle: 'User invitation', violations: [{ rule: 'label', impact: 'error', element: 'input' }], links: [] }
];

test('groups recurring accessibility rules across tests without exposing selectors', { tag: '@svc-internal' }, () => {
  const html = enhanceDashboardHtml(native, [], [], '../test-results', entries);
  const document = parse(html);
  const groups = document.querySelectorAll('.odhin-a11y-rule-group');

  expect(groups).toHaveLength(2);
  expect(groups[0].text).toContain('button-name');
  expect(groups[0].text).toContain('2 evidence records');
  expect(document.querySelector('#odhin-a11y-rule-search')?.getAttribute('aria-controls')).toBe('odhin-a11y-rule-groups');
  expect(document.querySelector('#odhin-a11y-filter-status')?.getAttribute('aria-live')).toBe('polite');
  expect(document.querySelectorAll('.odhin-a11y-evidence-jump')).toHaveLength(3);
  expect(html).not.toContain('private-avery@example.com');
  expect(html).not.toContain('case-123456789');
});

test('filters rules and opens matching evidence with keyboard focus', { tag: '@svc-internal' }, async ({ page }) => {
  await page.setContent(enhanceDashboardHtml(native, [], [], '../test-results', entries));
  await page.getByRole('button', { name: 'Accessibility evidence' }).click();
  const search = page.getByRole('searchbox', { name: 'Search rules and affected tests' });
  await search.fill('no such rule');
  await expect(page.locator('#odhin-a11y-filter-status')).toHaveText('0 of 2 rule groups match');
  await expect(page.locator('#odhin-a11y-no-match')).toBeVisible();

  await search.fill('button-name');
  await expect(page.locator('.odhin-a11y-rule-group:visible')).toHaveCount(1);
  const group = page.locator('.odhin-a11y-rule-group:visible');
  await group.locator('summary').click();
  const jump = group.getByRole('link', { name: 'Organisation details' });
  await jump.focus();
  await jump.press('Enter');
  await expect(page.locator('#odhin-a11y-evidence-0')).toHaveAttribute('open', '');
  await expect(page.locator('#odhin-a11y-evidence-0 summary')).toBeFocused();
});
