import { test, expect } from '@playwright/test';
import { signIn } from './helpers/login';

test('login and setup ccd roles', async ({ page }) => {
  //  login to admin web for pr env
  await signIn(page, 'ga', process.env.CCD_ADMIN_WEB_URL);
  await expect(page.getByRole('heading', { name: 'Welcome to CCD Admin Web' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage User Roles' }).click();
  await expect(page.getByRole('link', { name: 'Create User Role' })).toBeVisible();

  const tbody = await page.locator('//html/body/div[5]/table/tbody');
  const rows = await tbody.locator('tr').all();
  let foundRoles = 0;

  for (const row of rows) {
    const role = await row.locator('td').nth(0).innerText();
    const classification = await row.locator('td').nth(1).innerText();
    const found = ccdRoles.some(
      (r) => r.role === role && r.security_classification === classification
    );
    if (!found) {
      console.log(`Skipping unmatched role: ${role}, Classification: ${classification}`);
      continue;
    }
    foundRoles++;
    console.log(`Role: ${role}, Classification: ${classification}`);
    expect(found).toBeTruthy();
  }

  if (foundRoles === 0) {
    console.log('No matching roles found, creating new roles...');
    for (const ccdRole of ccdRoles) {
      await page.getByRole('link', { name: 'Create User Role' }).click();
      await page.locator('#role').click();
      await page.locator('#role').fill(ccdRole.role);
      await page.locator('#classification').selectOption(ccdRole.security_classification);
      await page.getByRole('button', { name: 'Create' }).click();
      await expect(page.getByText('✔ User role created.')).toBeVisible();
    }
  }
});

const ccdRoles = [
  { 'role': 'caseworker', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-approver', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-autotest1', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-autotest1-private', 'security_classification': 'PRIVATE' },
  { 'role': 'caseworker-autotest1-senior', 'security_classification': 'RESTRICTED' },
  { 'role': 'caseworker-autotest1-solicitor', 'security_classification': 'PRIVATE' },
  { 'role': 'caseworker-autotest2', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-autotest2-private', 'security_classification': 'PRIVATE' },
  { 'role': 'caseworker-autotest2-senior', 'security_classification': 'RESTRICTED' },
  { 'role': 'caseworker-autotest2-solicitor', 'security_classification': 'PRIVATE' },
  { 'role': 'caseworker-befta_jurisdiction_1', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-befta_jurisdiction_2', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-befta_jurisdiction_2-solicitor_1', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-befta_jurisdiction_2-solicitor_2', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-befta_jurisdiction_2-solicitor_3', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-befta_jurisdiction_3', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-befta_jurisdiction_3-solicitor', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-befta_master', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-befta_master-junior', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-befta_master-manager', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-befta_master-solicitor', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-befta_master-solicitor_1', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-befta_master-solicitor_2', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-befta_master-solicitor_3', 'security_classification': 'PUBLIC' },
  { 'role': 'caseworker-caa', 'security_classification': 'PUBLIC' },
  { 'role': 'ccd-import', 'security_classification': 'PUBLIC' },
  { 'role': 'manage-translations', 'security_classification': 'PUBLIC' },
  { 'role': 'load-translations', 'security_classification': 'PUBLIC' },
  { 'role': 'citizen', 'security_classification': 'PUBLIC' },
  { 'role': 'pui-caa', 'security_classification': 'PUBLIC' },
  { 'role': 'next-hearing-date-admin', 'security_classification': 'PUBLIC' },
  { 'role': 'GS_profile', 'security_classification': 'PUBLIC' },
  { 'role': 'ft_accessprofile_1', 'security_classification': 'PUBLIC' },
  { 'role': 'ft_accessprofile_3', 'security_classification': 'PUBLIC' }
]