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
});
