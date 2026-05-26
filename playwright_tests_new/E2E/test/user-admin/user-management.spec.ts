import { expect, test } from '../../fixtures';

test.describe('User administration', () => {
  test.beforeEach(async ({ signedInPage }) => {
    await expect(signedInPage.getByRole('link', { name: 'Organisation', exact: true })).toBeVisible();
  });

  test('active user details expose permission and suspend controls', { tag: ['@e2e', '@user-admin'] }, async ({ usersPage }) => {
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

  test('active user permissions can be reviewed without changing live access', { tag: ['@e2e', '@user-admin'] }, async ({ usersPage }) => {
    await usersPage.open();
    await usersPage.openFirstActiveUser();

    await expect(usersPage.userDetailsHeading).toBeVisible();
    await expect(usersPage.changePermissionsLink).toBeVisible();

    await usersPage.openEditPermissions();
    await expect(usersPage.editUserHeading).toBeVisible();

    const manageCases = usersPage.permissionCheckbox('Manage Cases');
    const manageUsers = usersPage.permissionCheckbox('Manage Users');
    const manageOrganisation = usersPage.permissionCheckbox('Manage Organisation');

    await expect(manageCases).toBeVisible();
    await expect(manageUsers).toBeVisible();
    await expect(manageOrganisation).toBeVisible();

    const initiallyChecked = await manageCases.isChecked();
    await manageCases.setChecked(!initiallyChecked);
    if (initiallyChecked) {
      await expect(manageCases).not.toBeChecked();
    } else {
      await expect(manageCases).toBeChecked();
    }
    await manageCases.setChecked(initiallyChecked);
  });

  test('pending user re-invite opens a prefilled read-only invite form', { tag: ['@e2e', '@user-admin'] }, async ({ usersPage }) => {
    await usersPage.open();
    const pendingUser = await usersPage.openFirstUserByStatus('Pending');
    test.skip(!pendingUser, 'No Pending user exists in the target organisation; re-invite UI coverage is scoped to available Pending users.');
    if (!pendingUser) {
      return;
    }

    await expect(usersPage.pendingUserDetailsHeading).toBeVisible();
    await expect(usersPage.resendInvitationButton).toBeVisible();

    await usersPage.openReinvite();

    await expect(usersPage.inviteUserHeading).toBeVisible();
    await expect(usersPage.firstNameInput).toBeDisabled();
    await expect(usersPage.firstNameInput).not.toHaveValue('');
    await expect(usersPage.lastNameInput).toBeDisabled();
    await expect(usersPage.lastNameInput).not.toHaveValue('');
    await expect(usersPage.emailInput).toBeDisabled();
    await expect(usersPage.emailInput).not.toHaveValue('');
    const prefilledName = `${await usersPage.firstNameInput.inputValue()} ${await usersPage.lastNameInput.inputValue()}`;
    expect(pendingUser.linkText).toContain(prefilledName);
    const prefilledEmail = await usersPage.emailInput.inputValue();
    expect(pendingUser.rowText).toContain(prefilledEmail);
    await expect(usersPage.backLink).toHaveAttribute('href', pendingUser.href);
  });
});
