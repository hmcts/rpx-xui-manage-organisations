import { test, expect } from '@playwright/test';
import { signIn } from './helpers/login';

test('login and log out from MC with valid user', async ({ page }) => {
  await signIn(page);
  console.log('i am signed in to the app');
  await expect(page.getByRole('heading', { name: 'Organisation' })).toBeVisible();
  console.log('i can see the heading');
  await expect(page.getByText('OrganisationNameCivil -')).toBeVisible();
  await expect(page.locator('app-prd-organisation-component')).toHaveCount(1);
  await page.getByRole('link', { name: 'Sign out' }).click();
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});
