import { expect, test } from '../../fixtures';
import { setupUserAdminRoutes } from '../../helpers';
import { userAdminActiveUser } from '../../mocks/userAdmin.mock';
import { UserAdminPage } from '../../page-objects/user-admin.po';
import { auditAccessibilityPage, type AccessibilityEngine } from '../../../E2E/utils/accessibility/accessibilityAudit';

const accessibilityEngines: AccessibilityEngine[] = ['axe', 'wave-like', 'screen-reader'];

test.describe('User administration accessibility', {
  tag: ['@integration', '@integration-user-admin', '@a11y']
}, () => {
  test('required-permission validation has accessible feedback', async ({
    manageOrgIntegrationPage: page
  }, testInfo) => {
    const routeState = await setupUserAdminRoutes(page);
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();
    await userAdminPage.openUserDetails(userAdminActiveUser.email);
    await userAdminPage.openEditPermissions(userAdminActiveUser.userIdentifier);
    await userAdminPage.permissionCheckbox('Manage Organisation').uncheck();
    await userAdminPage.permissionCheckbox('Manage Users').uncheck();
    await userAdminPage.submitEditPermissions();

    const errorMessage = 'You must select at least one action';
    await expect(userAdminPage.validationSummaryError(errorMessage)).toBeVisible();
    await expect(page.locator('#errorSummary')).toBeFocused();
    await expect(page.getByRole('group', { name: 'What user Permissions would you like to approve?' })).toBeVisible();
    await auditAccessibilityPage(page, testInfo, {
      defaultEngines: accessibilityEngines,
      feature: 'User administration',
      pageState: 'required permission validation'
    });
    expect(routeState.editUserPermissionRequests).toHaveLength(0);
  });

  test('suspend confirmation exposes accessible actions and an axe report', async ({
    manageOrgIntegrationPage: page
  }, testInfo) => {
    const routeState = await setupUserAdminRoutes(page);
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();
    await userAdminPage.openUserDetails(userAdminActiveUser.email);
    await userAdminPage.openSuspendConfirmation();

    await expect(userAdminPage.suspendAccountHeading).toBeVisible();
    await expect(page.getByText('If you suspend this user’s account, they’ll no longer be able to access MyHMCTS services.', { exact: false })).toBeVisible();
    await expect(userAdminPage.suspendAccountButton).toBeEnabled();
    await auditAccessibilityPage(page, testInfo, {
      defaultEngines: accessibilityEngines,
      feature: 'User administration',
      pageState: 'suspend confirmation'
    });
    await expect.soft(userAdminPage.backLink).toBeVisible();

    expect(routeState.suspendUserRequests).toHaveLength(0);
  });
});
