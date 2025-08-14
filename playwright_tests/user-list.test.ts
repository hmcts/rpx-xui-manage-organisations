import { test, expect } from '@playwright/test';
import { signIn } from './helpers/login';

test('validate users tab loads', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('link', { name: 'Organisation', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Users' }).click();
  await expect(page.locator('div').filter({ hasText: /^Users$/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Invite user' })).toBeVisible();
  await expect(page.locator('xuilib-user-list')).toBeVisible();
});
