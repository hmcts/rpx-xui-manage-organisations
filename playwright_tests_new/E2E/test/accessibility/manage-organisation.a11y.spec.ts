import { expect, test } from '../../fixtures';
import { auditAccessibilityPage, type AccessibilityEngine } from '../../utils/accessibility/accessibilityAudit';

const accessibilityEngines: AccessibilityEngine[] = ['axe', 'wave-like', 'screen-reader'];

const auditManageOrganisationPage = async (
  page: Parameters<typeof auditAccessibilityPage>[0],
  testInfo: Parameters<typeof auditAccessibilityPage>[1],
  pageState: string
): Promise<void> =>
  auditAccessibilityPage(page, testInfo, {
    defaultEngines: accessibilityEngines,
    feature: 'Manage Organisations',
    pageState
  });

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
      await auditManageOrganisationPage(signedInPage, testInfo, 'organisation details');
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
      await auditManageOrganisationPage(signedInPage, testInfo, 'users list');
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
      await auditManageOrganisationPage(signedInPage, testInfo, 'invite user form');
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
      if (!(await usersPage.isManageUserPage())) {
        await expect(usersPage.validationSummaryError('You must select at least one action')).toBeVisible();
      }
      await auditManageOrganisationPage(signedInPage, testInfo, 'invite user validation');
    }
  );

  test(
    'active user details page has actionable accessibility evidence',
    { tag: ['@e2e', '@a11y', '@user-admin'] },
    async ({ signedInPage, usersPage }, testInfo) => {
      await usersPage.open();
      await usersPage.openFirstActiveUser();

      await expect(usersPage.userDetails.or(usersPage.userDetailsHeading).first()).toBeVisible();
      await auditManageOrganisationPage(signedInPage, testInfo, 'active user details');
    }
  );
});
