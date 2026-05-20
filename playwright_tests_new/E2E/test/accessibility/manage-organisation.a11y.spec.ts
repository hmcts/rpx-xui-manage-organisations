import { AxeUtils } from '@hmcts/playwright-common';
import { expect, test } from '../../fixtures';

test.describe('authenticated Manage Organisation accessibility @a11y', () => {
  test.beforeEach(async ({ signedInPage }) => {
    await expect(signedInPage.getByRole('link', { name: 'Organisation', exact: true })).toBeVisible();
  });

  test(
    'organisation details page has no automatically detectable accessibility violations',
    { tag: ['@e2e', '@a11y', '@organisation'] },
    async ({ signedInPage, organisationPage }, testInfo) => {
      await organisationPage.open();

      await expect(organisationPage.heading).toBeVisible();
      await expect(organisationPage.root).toBeVisible();
      const axeUtils = new AxeUtils(signedInPage);
      await axeUtils.audit();
      await axeUtils.generateReport(testInfo, 'organisation details accessibility report');
    }
  );

  test(
    'users page has no automatically detectable accessibility violations',
    { tag: ['@e2e', '@a11y', '@user-admin'] },
    async ({ signedInPage, usersPage }, testInfo) => {
      await usersPage.open();

      await expect(usersPage.heading).toBeVisible();
      await expect(usersPage.inviteUserButton).toBeVisible();
      await expect(usersPage.userList).toBeVisible();
      const axeUtils = new AxeUtils(signedInPage);
      await axeUtils.audit();
      await axeUtils.generateReport(testInfo, 'users list accessibility report');
    }
  );

  test(
    'invite user page has no automatically detectable accessibility violations',
    { tag: ['@e2e', '@a11y', '@user-admin'] },
    async ({ signedInPage, usersPage }, testInfo) => {
      await usersPage.open();
      await usersPage.openInviteUser();

      await expect(usersPage.inviteUserHeading).toBeVisible();
      await expect(usersPage.firstNameInput).toBeVisible();
      await expect(usersPage.lastNameInput).toBeVisible();
      await expect(usersPage.emailInput).toBeVisible();
      const axeUtils = new AxeUtils(signedInPage);
      await axeUtils.audit();
      await axeUtils.generateReport(testInfo, 'invite user accessibility report');
    }
  );

  test(
    'invite user validation state has no automatically detectable accessibility violations',
    { tag: ['@e2e', '@a11y', '@user-admin', '@validation'] },
    async ({ signedInPage, usersPage }, testInfo) => {
      await usersPage.open();
      await usersPage.openInviteUser();
      await usersPage.submitInvite();

      await expect(usersPage.validationSummaryError('Enter first name')).toBeVisible();
      await expect(usersPage.validationSummaryError('Enter last name')).toBeVisible();
      await expect(usersPage.validationSummaryError('Enter a valid email address')).toBeVisible();
      await expect(usersPage.validationSummaryError('You must select at least one action')).toBeVisible();
      const axeUtils = new AxeUtils(signedInPage);
      await axeUtils.audit();
      await axeUtils.generateReport(testInfo, 'invite user validation accessibility report');
    }
  );
});
