// Run outside the Codex sandbox: node playwright_tests_new/common/reporters/presentation/browser-check.cjs <generated-report.html> [screenshot.png]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { chromium } = require('@playwright/test');

async function main() {
  const [reportPath, screenshotPath] = process.argv.slice(2);
  assert(reportPath && fs.statSync(reportPath).isFile(), 'Provide a generated Odhín report HTML file');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    const externalRequests = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route(/^https?:\/\//, (route) => {
      externalRequests.push(route.request().url());
      return route.abort();
    });
    await page.goto(pathToFileURL(reportPath).href);
    await page.locator('.report-metrics .report-metric').first().waitFor();
    await page.locator('#loading').waitFor({ state: 'hidden' });
    assert.equal(await page.locator('.report-metrics .report-metric').count(), 4);
    assert.equal(await page.locator('#TabDashboard .report-grid').count(), 1);
    assert.equal(await page.locator('.odhin-dashboard-stack').count(), 0);
    if (screenshotPath) await page.screenshot({ path: screenshotPath, fullPage: true });
    assert.equal(await page.locator('#test-list-table thead th').allTextContents().then((cells) => cells.slice(-3).join(',')), 'Feature,Tags,Attempt');
    const allRows = await page.locator('#test-list-table tbody tr.test-row-result').count();
    assert(allRows > 0, 'Generated report must contain tests');
    await page.locator('.main-tablinks[onclick*="TabTests"]').click();
    const features = page.locator('.report-filters select[data-filter="Feature"]');
    await features.selectOption({ index: 1 });
    assert.equal(await features.inputValue(), 'unit');
    await page.locator('.report-filters input[aria-label="Search tests"]').fill('no-such-report-test');
    assert.equal(await page.locator('#test-list-table tbody tr.test-row-result').count(), 0);
    await page.getByRole('button', { name: 'Clear filters' }).click();
    assert.equal(await page.locator('#test-list-table tbody tr.test-row-result').count(), allRows);
    await page.locator('.main-tablinks[onclick*="TabDashboard"]').click();
    const feature = page.locator('#odhin-feature-summary .feature-toggle').first();
    await feature.focus();
    await feature.press('Enter');
    assert.equal(await feature.getAttribute('aria-expanded'), 'true');
    const detail = page.locator('#odhin-feature-summary .feature-tests .test-detail-link').first();
    await detail.click();
    await page.locator('.modal.show').waitFor();
    assert.equal(await page.locator('.modal.show').count(), 1);
    await page.getByRole('button', { name: 'Back to filtered results' }).click();
    await page.locator('.modal.show').waitFor({ state: 'hidden' });
    assert.equal(await page.locator('.modal.show').count(), 0);
    await page.locator('.main-tablinks[onclick*="TabDashboard"]').click();
    await page.setViewportSize({ width: 390, height: 844 });
    const narrow = await page.locator('#TabDashboard .report-panel').evaluateAll((panels) =>
      panels.slice(1, 3).map((panel) => {
        const { x, y, width } = panel.getBoundingClientRect();
        return { x, y, width };
      }));
    assert.equal(narrow.length, 2);
    assert(narrow[0].width > 0 && narrow[1].width > 0);
    assert.equal(narrow[0].x, narrow[1].x, 'Dashboard panels should stack on narrow screens');
    assert(narrow[0].y < narrow[1].y, 'Dashboard panels should stack vertically');
    assert.deepEqual(errors, [], 'Browser page errors');
    assert.deepEqual(externalRequests, [], 'Report must not send data to external URLs');
    console.log(JSON.stringify({ reportPath, testRows: allRows, metrics: 4, featureKeyboard: true, modal: true, externalRequests: 0, pageErrors: 0 }));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
