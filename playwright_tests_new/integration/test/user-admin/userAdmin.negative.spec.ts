import { expect, test } from '../../fixtures';
import { setupUserAdminRoutes } from '../../helpers';
import {
  inviteUserFormData,
  userAdminActiveUser,
  userAdminOrganisationProfileIds,
  userAdminPendingUser
} from '../../mocks/userAdmin.mock';
import { UserAdminPage } from '../../page-objects/user-admin.po';

const requiredInviteFieldCases = [
  {
    field: 'first name',
    formData: { ...inviteUserFormData, firstName: '' },
    message: 'Enter first name'
  },
  {
    field: 'last name',
    formData: { ...inviteUserFormData, lastName: '' },
    message: 'Enter last name'
  },
  {
    field: 'email',
    formData: { ...inviteUserFormData, email: '' },
    message: 'Enter a valid email address'
  }
];

const requiredInviteFieldMessages = requiredInviteFieldCases.map(({ message }) => message);

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

  for (const { field, formData, message } of requiredInviteFieldCases) {
    test(`validates missing standard invite ${field} without posting an invite`, async ({
      manageOrgIntegrationPage: page
    }) => {
      const routeState = await setupUserAdminRoutes(page);
      const userAdminPage = new UserAdminPage(page);

      await userAdminPage.openUsers();
      await userAdminPage.openInviteUser();
      await userAdminPage.fillInviteUser(formData);
      await userAdminPage.selectPermissions('Manage Users');
      await userAdminPage.submitInvite();

      await expect(userAdminPage.validationSummaryError(message)).toBeVisible();
      for (const otherMessage of requiredInviteFieldMessages.filter((requiredMessage) => requiredMessage !== message)) {
        await expect(userAdminPage.validationSummaryError(otherMessage)).toHaveCount(0);
      }
      await expect(userAdminPage.validationSummaryError('You must select at least one action')).toHaveCount(0);
      expect(routeState.inviteUserRequests).toHaveLength(0);
    });
  }

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

  test('validates required OGD manage-user fields without posting an invite', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUserAdminRoutes(page, { enableOgdInviteUserFlow: true });
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();
    await userAdminPage.openInviteUser();
    await userAdminPage.submitInvite();

    await expect(page).toHaveURL(/\/users\/manage$/);
    await expect(userAdminPage.validationSummaryError('Enter first name')).toBeVisible();
    await expect(userAdminPage.validationSummaryError('Enter last name')).toBeVisible();
    await expect(userAdminPage.validationSummaryError('Enter a valid email address')).toBeVisible();
    await expect(userAdminPage.validationSummaryError('Select at least one permission')).toBeVisible();
    await expect(page.getByText(/You must select at least\s+one action/)).toBeVisible();
    expect(routeState.ogdInviteUserRequests).toHaveLength(0);
    expect(routeState.inviteUserRequests).toHaveLength(0);
  });

  for (const { field, formData, message } of requiredInviteFieldCases) {
    test(`validates missing OGD manage-user ${field} without posting an invite`, async ({
      manageOrgIntegrationPage: page
    }) => {
      const routeState = await setupUserAdminRoutes(page, { enableOgdInviteUserFlow: true });
      const userAdminPage = new UserAdminPage(page);

      await userAdminPage.openUsers();
      await userAdminPage.openInviteUser();
      await userAdminPage.fillInviteUser(formData);
      await userAdminPage.selectPermissions('Case access administrator');
      await userAdminPage.submitInvite();

      await expect(page).toHaveURL(/\/users\/manage$/);
      await expect(userAdminPage.validationSummaryError(message)).toBeVisible();
      for (const otherMessage of requiredInviteFieldMessages.filter((requiredMessage) => requiredMessage !== message)) {
        await expect(userAdminPage.validationSummaryError(otherMessage)).toHaveCount(0);
      }
      await expect(userAdminPage.validationSummaryError('Select at least one permission')).toHaveCount(0);
      expect(routeState.ogdInviteUserRequests).toHaveLength(0);
      expect(routeState.inviteUserRequests).toHaveLength(0);
    });
  }

  test('validates missing OGD manage-user permissions without posting an invite', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUserAdminRoutes(page, { enableOgdInviteUserFlow: true });
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();
    await userAdminPage.openInviteUser();
    await userAdminPage.fillInviteUser(inviteUserFormData);
    await userAdminPage.submitInvite();

    await expect(page).toHaveURL(/\/users\/manage$/);
    await expect(userAdminPage.validationSummaryError('Enter first name')).toHaveCount(0);
    await expect(userAdminPage.validationSummaryError('Enter last name')).toHaveCount(0);
    await expect(userAdminPage.validationSummaryError('Enter a valid email address')).toHaveCount(0);
    await expect(userAdminPage.validationSummaryError('Select at least one permission')).toBeVisible();
    expect(routeState.ogdInviteUserRequests).toHaveLength(0);
    expect(routeState.inviteUserRequests).toHaveLength(0);
  });

  test('validates malformed OGD manage-user email without posting an invite', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUserAdminRoutes(page, { enableOgdInviteUserFlow: true });
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();
    await userAdminPage.openInviteUser();
    await userAdminPage.fillInviteUser({
      ...inviteUserFormData,
      email: 'not-an-email'
    });
    await userAdminPage.selectPermissions('Case access administrator');
    await userAdminPage.submitInvite();

    await expect(page).toHaveURL(/\/users\/manage$/);
    await expect(userAdminPage.validationSummaryError('Enter a valid email address')).toBeVisible();
    await expect(userAdminPage.validationSummaryError('Select at least one permission')).toHaveCount(0);
    expect(routeState.ogdInviteUserRequests).toHaveLength(0);
    expect(routeState.inviteUserRequests).toHaveLength(0);
  });

  test('routes OGD manage-user update failure to the service failure page', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUserAdminRoutes(page, {
      enableOgdInviteUserFlow: true,
      ogdUpdateStatus: 500,
      ogdUpdateResponse: {
        error: {
          apiError: 'OGD update failed',
          apiStatusCode: 500,
          message: 'Access type update failed'
        }
      }
    });
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();
    await userAdminPage.openUserDetails(userAdminActiveUser.email);
    await userAdminPage.openEditPermissions(userAdminActiveUser.userIdentifier);
    await userAdminPage.permissionCheckbox('Manage cases for your organisation').check();
    await userAdminPage.submitEditPermissions();

    await expect.poll(() => routeState.ogdEditUserPermissionRequests.length).toBe(1);
    await expect(page).toHaveURL(/\/service-down$/);
    await expect(page.getByRole('heading', { name: 'Sorry, there is a problem with the service' })).toBeVisible();
  });

  test('routes OGD manage-user invite failure to the service failure page', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUserAdminRoutes(page, {
      enableOgdInviteUserFlow: true,
      ogdInviteStatus: 500,
      ogdInviteResponse: {
        error: {
          apiError: 'OGD invite failed',
          apiStatusCode: 500,
          message: 'Invite failed'
        }
      }
    });
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();
    await userAdminPage.openInviteUser();
    await userAdminPage.fillInviteUser(inviteUserFormData);
    await userAdminPage.selectPermissions(
      'Case access administrator',
      'Manage cases for your organisation'
    );
    await userAdminPage.submitInvite();

    await expect.poll(() => routeState.ogdInviteUserRequests.length).toBe(1);
    expect(routeState.inviteUserRequests).toHaveLength(0);
    expect(routeState.ogdInviteUserRequests[0].orgIdsPayload).toEqual(userAdminOrganisationProfileIds);
    await expect(page).toHaveURL(/\/service-down$/);
    await expect(page.getByRole('heading', { name: 'Sorry, there is a problem with the service' })).toBeVisible();
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
