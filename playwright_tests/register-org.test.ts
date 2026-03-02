import { test, expect } from '@playwright/test';
import { signIn } from './helpers/login';
import { navigateToUrl } from './helpers/navigate';
import { createDXENumber, createDXNumber, createSRANumber } from './helpers/register-org';
import { randomString } from './helpers/string';

test('register a new organisation using register-org-new', async ({ page }) => {
  await signIn(page, 'roo');
  await expect(page.getByText('OrganisationNameXUI ROO')).toBeVisible();
  await navigateToUrl(page, '/register-org-new/register');

  // before you start page
  await expect(page.getByRole('heading', { name: 'Apply for an organisation to' })).toBeVisible();
  await page.locator('#confirmed-organisation-account').check();
  await page.getByRole('button', { name: 'Start' }).click();

  // organisation-type page
  await expect(page.getByRole('heading', { name: 'What type of organisation are' })).toBeVisible();
  await page.getByLabel('Solicitor', { exact: true }).check();
  await page.getByRole('button', { name: 'Continue' }).click();

  // company-house-details page
  await expect(page.getByRole('heading', { name: 'What is your organisation name' })).toBeVisible();
  await page.locator('#company-name').fill('Test Organisation Ltd');
  await page.getByRole('button', { name: 'Continue' }).click();

  // registered-address page
  await expect(page.getByRole('heading', { name: 'What is the registered address' })).toBeVisible();
  await page.locator('#postcodeInput').fill('SW1A 1AA');
  await page.getByRole('button', { name: 'Find address' }).click();
  await page.waitForSelector('#addressList');
  await page.selectOption('select', { label: 'Buckingham Palace, London' });
  await page.getByRole('button', { name: 'Continue' }).click();

  // document-exchange-reference page
  await expect(page.getByText('Do you have a document exchange reference for your main office?')).toBeVisible();
  await page.check('#document-exchange-yes');
  await page.getByRole('button', { name: 'Continue' }).click();

  // document-exchange-reference-details page
  await expect(page.getByRole('heading', { name: ' What\'s the DX reference for this office?' })).toBeVisible();
  await page.getByLabel('DX number (Optional)').fill(await createDXNumber());
  await page.getByLabel('DX exchange (Optional)').fill(await createDXENumber());
  await page.getByRole('button', { name: 'Continue' }).click();

  // regulatory-organisation-type page
  await expect(page.getByText('Who is your organisation registered with?')).toBeVisible();
  await page.waitForSelector('#regulator-type0');
  await page.selectOption('select', { value: 'Solicitor Regulation Authority (SRA)' });

  await page.waitForSelector('#organisation-registration-number0');
  await page.locator('#organisation-registration-number0').fill(await createSRANumber());
  await page.getByRole('button', { name: 'Continue' }).click();

  // organisation-services-access page
  await expect(page.getByText('Which services will your organisation need to access?')).toBeVisible();
  await page.check('#Divorce');
  await page.getByRole('button', { name: 'Continue' }).click();

  // payment-by-account page
  await expect(page.getByText('Does your organisation have a payment by account number?')).toBeVisible();
  console.log('On payment by account page');
  await page.locator('#pba-no').check();
  await page.getByRole('button', { name: 'Continue' }).click();

  // contact-details page
  await expect(page.getByRole('heading', { name: 'Provide your contact details' })).toBeVisible();
  await page.getByLabel('First name').fill('John');
  await page.getByLabel('Last name').fill('Doe');
  const emailPrefix = await randomString(7);
  await page.getByLabel('Enter your work email address').fill(`${emailPrefix}@example.com`);
  await page.getByRole('button', { name: 'Continue' }).click();

  // individual-registered-with-regulator page
  await expect(page.getByText('Are you (as an individual) registered with a regulator')).toBeVisible();
  await page.locator('#registered-with-regulator-no').check();
  await page.getByRole('button', { name: 'Continue' }).click();

  // check-your-answers page
  await expect(page.getByRole('heading', { name: 'Check your answers before you' })).toBeVisible();
  await page.locator('#confirm-terms-and-conditions').check();
  await page.getByRole('button', { name: 'Confirm and submit' }).click();

  // registration-submitted page
  await expect(page.getByRole('heading', { name: ' Registration details submitted' })).toBeVisible({ timeout: 30000 });
});