import { test, expect } from '@playwright/test';
import { signIn } from './helpers/login';

test('validate assigned cases tab loads', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('link', { name: 'Organisation', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Assigned cases', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Assigned Cases' })).toBeVisible();
  await expect(page.getByText('Select any CIVIL cases you')).toBeVisible();
  await expect(page.getByRole('tab', { name: 'CIVIL' })).toBeVisible();
});
