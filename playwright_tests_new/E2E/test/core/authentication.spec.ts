import { test, expect } from '../../fixtures';

test(
  'signs in to Manage Organisation and signs out through the header control',
  { tag: ['@e2e', '@auth'] },
  async ({ signedInPage, idamPage, organisationPage }) => {
    await expect(organisationPage.navigationLink).toBeVisible();
    await expect(signedInPage.getByRole('link', { name: 'Users', exact: true })).toBeVisible();

    await organisationPage.signOut();

    await expect(idamPage.heading).toBeVisible();
    await expect(signedInPage).toHaveURL(/\/login/);
  }
);
