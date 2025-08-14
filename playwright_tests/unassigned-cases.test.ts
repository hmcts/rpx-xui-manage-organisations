import { test, expect } from '@playwright/test';
import { signIn } from './helpers/login';

test('validate unassigned cases tab loads', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('link', { name: 'Organisation', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Unassigned cases' }).click();
  await expect(page.getByRole('heading', { name: 'Unassigned Cases' })).toBeVisible();
  await expect(page.getByText('Can\'t find a case? You might')).toBeVisible();
  await expect(page.getByText('You can share a case from')).toBeVisible();
  await expect(page.getByText('Select any CIVIL cases you')).toBeVisible();
});
