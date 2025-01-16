import { test, expect } from '@playwright/test';
import { signIn } from './helpers/login';
import { navigateToUrl } from './helpers/navigate';
import { createDXENumber, createDXNumber, createSRANumber } from './helpers/register-org';
import { randomString } from './helpers/string';

test('register a new organistation', async ({ page }) => {
  await signIn(page, 'roo');
  await expect(page.getByText('OrganisationNameXUI ROO')).toBeVisible();
  await navigateToUrl(page, '/register-org/register');
  await expect(page.getByRole('heading', { name: 'Register to manage civil,' })).toBeVisible();
  console.log('Going to create a new organisation');
  await page.getByLabel('Start registering organisation').click();
  await expect(page.getByRole('heading', { name: 'What\'s the name of your' })).toBeVisible();
  await page.getByLabel('what is the name of your').click();
  await page.getByLabel('what is the name of your').fill('asdpoj');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'What\'s the address of your' })).toBeVisible();
  await expect(page.getByText('Building and street', { exact: true })).toBeVisible();
  await page.getByLabel('Building and street', { exact: true }).click();
  await page.getByLabel('Building and street', { exact: true }).fill('12398');
  await expect(page.getByText('Town or city')).toBeVisible();
  await page.getByLabel('Town or city').click();
  await page.getByLabel('Town or city').fill('london');
  await expect(page.getByText('County')).toBeVisible();
  await page.getByLabel('County').click();
  await page.getByLabel('County').fill('london');
  await expect(page.getByText('Postcode')).toBeVisible();
  await page.getByLabel('Postcode').click();
  await page.getByLabel('Postcode').fill('SW1A1AA');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'What payment by account (PBA' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add another PBA number' })).toBeVisible();
  await expect(page.getByText('PBA number (Optional)')).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'Do you have a Document' })).toBeVisible();
  await page.getByLabel('Yes').check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('DX number (Optional)').click();
  await page.getByLabel('DX number (Optional)').fill(await createDXNumber());
  await page.getByLabel('DX exchange (Optional)').click();
  await page.getByLabel('DX exchange (Optional)').fill(await createDXENumber());
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'Do you have an organisation' })).toBeVisible();
  await page.getByLabel('Yes').check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Enter your organisation SRA ID').click();
  await page.getByLabel('Enter your organisation SRA ID').fill(await createSRANumber());
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('First name').click();
  await page.getByLabel('First name').fill('joe');
  await page.getByLabel('Last name').click();
  await page.getByLabel('Last name').fill('bloggs');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('What is your email address').click();
  const emailPrefix = await randomString(7);
  await page.getByLabel('What is your email address').fill(`${emailPrefix}@mail.com`);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'Check your answers before you' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Now submit your registration' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirm and submit details' }).click();
  await page.locator('div').filter({ hasText: 'Register to manage civil,' }).nth(1).click();
});
