import { test, expect } from '@playwright/test';
import { signIn } from './helpers/login';
import { openFirstActiveUser } from './helpers/user-management';

test('active user details expose change and suspend controls and open suspend confirmation', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('link', { name: 'Organisation', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'Users' }).click();
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  await openFirstActiveUser(page);

  await expect(page.getByRole('heading', { name: 'User details' })).toBeVisible();
  await expect(page.locator('xuilib-user-details')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Change' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Suspend account' })).toBeVisible();

  await page.getByRole('button', { name: 'Suspend account' }).click();

  await expect(page.getByRole('heading', { name: 'Are you sure you want to suspend this account?' })).toBeVisible();
  await expect(page.getByText('they\'ll no longer be able to access MyHMCTS services')).toBeVisible();
});
