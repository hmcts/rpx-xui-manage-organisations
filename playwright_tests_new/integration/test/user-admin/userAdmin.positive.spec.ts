import { expect, test } from '../../fixtures';
import { setupUserAdminRoutes } from '../../helpers';
import {
  expectedCcdCaseworkerRoles,
  inviteUserFormData,
  userAdminActiveUser,
  userAdminPendingUser
} from '../../mocks/userAdmin.mock';
import { UserAdminPage } from '../../page-objects/user-admin.po';

const expectedRolesFor = (permissions: string[]): string[] => {
  const roles = [
    { permission: 'Manage Cases', role: 'pui-case-manager' },
    { permission: 'Manage Users', role: 'pui-user-manager' },
    { permission: 'Manage Organisation', role: 'pui-organisation-manager' }
  ]
    .filter(({ permission }) => permissions.includes(permission))
    .map(({ role }) => role);

  return permissions.includes('Manage Cases')
    ? [...roles, ...expectedCcdCaseworkerRoles]
    : roles;
};

const expectRoleNames = (
  actualRoles: { name: string }[],
  expectedRoleNames: string[]
): void => {
  expect(actualRoles.map(({ name }) => name).sort()).toEqual([...expectedRoleNames].sort());
};

test.describe('User administration', { tag: ['@integration', '@integration-user-admin'] }, () => {
  test('renders the users list and returns from invite-user with the back link', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUserAdminRoutes(page);
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();

    await expect(userAdminPage.heading).toBeVisible();
    await expect(userAdminPage.inviteUserButton).toBeVisible();
    await expect(userAdminPage.userList).toContainText(userAdminActiveUser.email);
    await expect(userAdminPage.userList).toContainText(userAdminPendingUser.email);
    await expect(userAdminPage.userRow(userAdminActiveUser.email)).toContainText(userAdminActiveUser.fullName);
    await expect(userAdminPage.userRow(userAdminPendingUser.email)).toContainText(userAdminPendingUser.fullName);
    await expect(userAdminPage.userStatusCell(userAdminActiveUser.email)).toHaveText('Active');
    await expect(userAdminPage.userStatusCell(userAdminPendingUser.email)).toHaveText('Pending');
    expect((await userAdminPage.tableCellTexts()).every((cellText) => cellText.length > 0)).toBe(true);
    await expect.poll(() => routeState.userListRequests.length).toBeGreaterThan(0);
    expect(routeState.userListRequests.every((method) => method === 'GET')).toBe(true);

    await userAdminPage.openInviteUser();

    await expect(page).toHaveURL(/\/users\/invite-user$/);
    await expect(userAdminPage.inviteUserHeading).toBeVisible();
    await expect.poll(() => routeState.jurisdictionRequests.length).toBeGreaterThan(0);
    expect(routeState.jurisdictionRequests.every((method) => method === 'GET')).toBe(true);

    await userAdminPage.goBack();

    await expect(page).toHaveURL(/\/users$/);
    await expect(userAdminPage.heading).toBeVisible();
    expect(routeState.inviteUserRequests).toHaveLength(0);
  });

  for (const permissions of [
    ['Manage Users'],
    ['Manage Users', 'Manage Organisation', 'Manage Cases'],
    ['Manage Organisation'],
    ['Manage Cases']
  ]) {
    test(`submits invite-user payload for ${permissions.join(', ')}`, async ({
      manageOrgIntegrationPage: page
    }) => {
      const routeState = await setupUserAdminRoutes(page);
      const userAdminPage = new UserAdminPage(page);

      await userAdminPage.openUsers();
      await userAdminPage.openInviteUser();
      await userAdminPage.fillInviteUser(inviteUserFormData);
      await userAdminPage.selectPermissions(...permissions);
      await userAdminPage.submitInvite();

      await expect(userAdminPage.confirmationPanel).toContainText('You\'ve invited');
      await expect(userAdminPage.confirmationPanel).toContainText(inviteUserFormData.email);
      await expect(page).toHaveURL(/\/users\/invite-user-success$/);
      await expect.poll(() => routeState.inviteUserRequests.length).toBe(1);
      expect(routeState.inviteUserRequests[0]).toEqual({
        ...inviteUserFormData,
        method: 'POST',
        resendInvite: false,
        roles: expectedRolesFor(permissions)
      });
    });
  }

  test('re-invites a pending user with locked identity fields and resend payload', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUserAdminRoutes(page);
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();
    await userAdminPage.openUserDetails(userAdminPendingUser.email);

    await expect(userAdminPage.pendingUserDetailsHeading).toBeVisible();
    await expect(userAdminPage.userDetailValue('Name')).toContainText(userAdminPendingUser.fullName);
    await expect(userAdminPage.userDetailValue('Email address')).toContainText(userAdminPendingUser.email);
    await expect(userAdminPage.resendInvitationButton).toBeVisible();

    await userAdminPage.openReinvite();

    await expect(page).toHaveURL(/\/users\/invite-user$/);
    await expect(userAdminPage.inviteUserHeading).toBeVisible();
    await expect(userAdminPage.backLink).toHaveAttribute(
      'href',
      `/users/user/${userAdminPendingUser.userIdentifier}`
    );
    await expect(userAdminPage.firstNameInput).toHaveValue(userAdminPendingUser.firstName);
    await expect(userAdminPage.lastNameInput).toHaveValue(userAdminPendingUser.lastName);
    await expect(userAdminPage.emailInput).toHaveValue(userAdminPendingUser.email);
    await expect(userAdminPage.firstNameInput).toBeDisabled();
    await expect(userAdminPage.lastNameInput).toBeDisabled();
    await expect(userAdminPage.emailInput).toBeDisabled();

    await userAdminPage.selectPermissions('Manage Users');
    await userAdminPage.submitInvite();

    await expect(userAdminPage.confirmationPanel).toContainText('You\'ve invited');
    await expect(userAdminPage.confirmationPanel).toContainText(userAdminPendingUser.email);
    await expect(page).toHaveURL(/\/users\/invite-user-success$/);
    await expect.poll(() => routeState.inviteUserRequests.length).toBe(1);
    expect(routeState.inviteUserRequests[0]).toEqual({
      email: userAdminPendingUser.email,
      firstName: userAdminPendingUser.firstName,
      lastName: userAdminPendingUser.lastName,
      method: 'POST',
      resendInvite: true,
      roles: ['pui-user-manager']
    });
  });

  test('submits edit-permissions role additions and deletions for an active user', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUserAdminRoutes(page);
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();
    await userAdminPage.openUserDetails(userAdminActiveUser.email);

    await expect(userAdminPage.userDetailsHeading).toBeVisible();
    await expect(userAdminPage.userDetailValue('Name')).toContainText(userAdminActiveUser.fullName);
    await expect(userAdminPage.userDetailValue('Email address')).toContainText(userAdminActiveUser.email);
    await expect(userAdminPage.userDetailValue('Permissions')).toContainText('Manage organisations');
    await expect(userAdminPage.userDetailValue('Permissions')).toContainText('Manage users');
    await expect(page.getByRole('link', { name: 'Change roles' })).toBeVisible();

    await userAdminPage.openEditPermissions();

    await expect(page).toHaveURL(new RegExp(`/users/user/${userAdminActiveUser.userIdentifier}/editpermission$`));
    await expect(userAdminPage.editUserHeading).toBeVisible();
    await expect(page.getByRole('heading', { name: `${userAdminActiveUser.firstName}, ${userAdminActiveUser.lastName}` })).toBeVisible();
    await expect(userAdminPage.permissionCheckbox('Manage Organisation')).toBeChecked();
    await expect(userAdminPage.permissionCheckbox('Manage Users')).toBeChecked();
    await expect(userAdminPage.permissionCheckbox('Manage Cases')).not.toBeChecked();

    await userAdminPage.permissionCheckbox('Manage Users').uncheck();
    await userAdminPage.permissionCheckbox('Manage Cases').check();
    await userAdminPage.submitEditPermissions();

    await expect.poll(() => routeState.editUserPermissionRequests.length).toBe(1);
    expect(routeState.editUserPermissionRequests[0]).toMatchObject({
      email: userAdminActiveUser.email,
      firstName: userAdminActiveUser.firstName,
      idamStatus: userAdminActiveUser.idamStatus,
      lastName: userAdminActiveUser.lastName,
      method: 'PUT',
      userId: userAdminActiveUser.userIdentifier
    });
    expectRoleNames(routeState.editUserPermissionRequests[0].rolesAdd, [
      'pui-case-manager',
      ...expectedCcdCaseworkerRoles
    ]);
    expectRoleNames(routeState.editUserPermissionRequests[0].rolesDelete, ['pui-user-manager']);
    await expect(page).toHaveURL(new RegExp(`/users/user/${userAdminActiveUser.userIdentifier}$`));
    await expect.poll(() => routeState.allUserListRequests.length).toBeGreaterThan(0);
    expect(routeState.allUserListRequests.every((method) => method === 'GET')).toBe(true);
  });

  test('suspends an active user through the confirmation view', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUserAdminRoutes(page);
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();
    await userAdminPage.openUserDetails(userAdminActiveUser.email);

    await expect(userAdminPage.userDetailsHeading).toBeVisible();
    await expect(userAdminPage.suspendAccountButton).toBeVisible();

    await userAdminPage.openSuspendConfirmation();

    await expect(userAdminPage.suspendAccountHeading).toBeVisible();
    await expect(userAdminPage.userDetailValue('Name')).toContainText(userAdminActiveUser.fullName);
    await expect(userAdminPage.userDetailValue('Email address')).toContainText(userAdminActiveUser.email);

    await userAdminPage.confirmSuspendAccount();

    await expect.poll(() => routeState.suspendUserRequests.length).toBe(1);
    expect(routeState.suspendUserRequests[0]).toMatchObject({
      email: userAdminActiveUser.email,
      firstName: userAdminActiveUser.firstName,
      idamStatus: 'SUSPENDED',
      lastName: userAdminActiveUser.lastName,
      method: 'PUT',
      userId: userAdminActiveUser.userIdentifier,
      userIdentifier: userAdminActiveUser.userIdentifier
    });
    await expect(userAdminPage.userDetailsHeading).toBeVisible();
    await expect(userAdminPage.userDetailValue('Permissions')).toContainText('Manage organisations');
    await expect(page.getByText('This user\'s account has been suspended.')).toBeVisible();
  });
});
