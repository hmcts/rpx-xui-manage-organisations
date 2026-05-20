import { expect, test } from '../../fixtures';
import { setupUserAdminRoutes } from '../../helpers';
import { inviteUserFormData } from '../../mocks/userAdmin.mock';
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
});
