import { expect, test } from '../../fixtures';

test.describe('User administration', () => {
  test('active user details expose permission and suspend controls', async ({ signedInPage, usersPage }) => {
    await expect(signedInPage.getByRole('link', { name: 'Organisation', exact: true })).toBeVisible();

    await usersPage.open();
    await expect(usersPage.heading).toBeVisible();
    await expect(usersPage.inviteUserButton).toBeVisible();
    await usersPage.openFirstActiveUser();

    await expect(usersPage.userDetailsHeading).toBeVisible();
    await expect(usersPage.userDetails).toBeVisible();
    await expect(usersPage.changePermissionsLink).toBeVisible();
    await expect(usersPage.suspendAccountButton).toBeVisible();

    await usersPage.openSuspendConfirmation();

    await expect(usersPage.suspendConfirmationHeading).toBeVisible();
    await expect(usersPage.userDetails).toContainText(/they.ll no longer be able to access MyHMCTS services/);
  });
});
