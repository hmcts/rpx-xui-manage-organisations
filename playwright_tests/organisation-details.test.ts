import { test, expect } from '@playwright/test';
import { signIn } from './helpers/login';

test('validate organisation details tab shows name and address details', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('link', { name: 'Organisation', exact: true })).toBeVisible();
  const organisationResponse = await page.request.get('/api/organisation');
  expect(organisationResponse.ok()).toBeTruthy();
  const expectedOrganisation = await organisationResponse.json();
  const expectedAddressLine = expectedOrganisation.contactInformation[0].addressLine1;

  await page.getByRole('link', { name: 'Organisation', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Organisation' })).toBeVisible();
  const organisationDetails = page.locator('app-prd-organisation-component');
  const nameRow = organisationDetails
    .locator('.govuk-summary-list__row, .govuk-table__row')
    .filter({ has: page.locator('.govuk-summary-list__key, .govuk-table__header', { hasText: /^Name$/ }) });
  const addressRow = organisationDetails
    .locator('.govuk-summary-list__row, .govuk-table__row')
    .filter({ has: page.locator('.govuk-summary-list__key, .govuk-table__header', { hasText: /^(Organisation address|Address)$/ }) });

  await expect(organisationDetails).toBeVisible();
  await expect(nameRow.locator('.govuk-summary-list__value, .govuk-table__cell')).toContainText(expectedOrganisation.name);
  await expect(addressRow.locator('.govuk-summary-list__value, .govuk-table__cell')).toContainText(expectedAddressLine);
});
