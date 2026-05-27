import { expect, test } from '../../fixtures';
import { setupUserAdminRoutes } from '../../helpers';
import {
  inviteUserFormData,
  userAdminActiveUser,
  userAdminPendingUser
} from '../../mocks/userAdmin.mock';
import { UserAdminPage } from '../../page-objects/user-admin.po';

test.describe('User administration negative paths', {
  tag: ['@integration', '@integration-user-admin']
}, () => {
  test('validates required invite-user fields and missing permissions without posting an invite', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUserAdminRoutes(page);
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();
    await userAdminPage.openInviteUser();
    await userAdminPage.submitInvite();

    await expect(userAdminPage.validationSummaryError('Enter first name')).toBeVisible();
    await expect(userAdminPage.validationSummaryError('Enter last name')).toBeVisible();
    await expect(userAdminPage.validationSummaryError('Enter a valid email address')).toBeVisible();
    await expect(userAdminPage.validationSummaryError('You must select at least one action')).toBeVisible();

    await userAdminPage.fillInviteUser(inviteUserFormData);
    await userAdminPage.submitInvite();

    await expect(userAdminPage.validationSummaryError('Enter first name')).toHaveCount(0);
    await expect(userAdminPage.validationSummaryError('Enter last name')).toHaveCount(0);
    await expect(userAdminPage.validationSummaryError('Enter a valid email address')).toHaveCount(0);
    await expect(userAdminPage.validationSummaryError('You must select at least one action')).toBeVisible();
    expect(routeState.inviteUserRequests).toHaveLength(0);
  });

  test('validates malformed invite-user email without posting an invite', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUserAdminRoutes(page);
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();
    await userAdminPage.openInviteUser();
    await userAdminPage.fillInviteUser({
      ...inviteUserFormData,
      email: 'not-an-email'
    });
    await userAdminPage.selectPermissions('Manage Users');
    await userAdminPage.submitInvite();

    await expect(userAdminPage.validationSummaryError('Enter a valid email address')).toBeVisible();
    await expect(userAdminPage.validationSummaryError('You must select at least one action')).toHaveCount(0);
    expect(routeState.inviteUserRequests).toHaveLength(0);
  });

  test('validates pending-user re-invite permissions without posting an invite', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUserAdminRoutes(page);
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();
    await userAdminPage.openUserDetails(userAdminPendingUser.email);
    await userAdminPage.openReinvite();
    await userAdminPage.submitInvite();

    await expect(userAdminPage.validationSummaryError('You must select at least one action')).toBeVisible();
    await expect(userAdminPage.firstNameInput).toHaveValue(userAdminPendingUser.firstName);
    await expect(userAdminPage.lastNameInput).toHaveValue(userAdminPendingUser.lastName);
    await expect(userAdminPage.emailInput).toHaveValue(userAdminPendingUser.email);
    await expect(userAdminPage.firstNameInput).toBeDisabled();
    await expect(userAdminPage.lastNameInput).toBeDisabled();
    await expect(userAdminPage.emailInput).toBeDisabled();
    expect(routeState.inviteUserRequests).toHaveLength(0);
  });

  test('returns from suspend confirmation without suspending the active user', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUserAdminRoutes(page);
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();
    await userAdminPage.openUserDetails(userAdminActiveUser.email);
    await userAdminPage.openSuspendConfirmation();

    await expect(userAdminPage.suspendAccountHeading).toBeVisible();
    await expect(userAdminPage.userDetailValue('Name')).toContainText(userAdminActiveUser.fullName);
    await expect(userAdminPage.userDetailValue('Email address')).toContainText(userAdminActiveUser.email);

    await userAdminPage.goBack();

    await expect(page).toHaveURL(new RegExp(`/users/user/${userAdminActiveUser.userIdentifier}$`));
    await expect(userAdminPage.userDetailsHeading).toBeVisible();
    await expect(userAdminPage.userDetailValue('Email address')).toContainText(userAdminActiveUser.email);
    expect(routeState.suspendUserRequests).toHaveLength(0);
  });
});
