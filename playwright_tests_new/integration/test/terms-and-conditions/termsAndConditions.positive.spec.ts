import { expect, test } from '../../fixtures';
import { setupTermsAndConditionsRoutes } from '../../helpers';
import { manageOrgIntegrationUserDetails } from '../../mocks/manageOrgIntegration.mock';
import { TermsAndConditionsPage } from '../../page-objects/terms-and-conditions.po';
import { UserAdminPage } from '../../page-objects/user-admin.po';

test.describe('Terms and conditions acceptance', {
  tag: ['@integration', '@integration-terms']
}, () => {
  test('requires terms acceptance before protected user administration and records the current user payload', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupTermsAndConditionsRoutes(page);
    const termsPage = new TermsAndConditionsPage(page);

    await page.goto('/users');

    await expect(page).toHaveURL(/\/accept-terms-and-conditions$/);
    await expect(termsPage.heading).toBeVisible();
    await expect(termsPage.termsLink).toHaveAttribute('href', '/terms-and-conditions');
    await expect.poll(() => routeState.userTermsStatusRequests.length).toBeGreaterThan(0);
    expect(routeState.userTermsStatusRequests).toContainEqual({
      method: 'GET',
      userId: manageOrgIntegrationUserDetails.userId
    });
    expect(routeState.acceptTermsRequests).toHaveLength(0);

    await termsPage.confirm();

    await expect.poll(() => routeState.acceptTermsRequests.length).toBeGreaterThan(0);
    expect(routeState.acceptTermsRequests.every((request) =>
      request.method === 'POST' && request.userId === manageOrgIntegrationUserDetails.userId
    )).toBe(true);
    await expect(page).toHaveURL(/\/organisation$/);
  });

  test('opens protected user administration without posting acceptance when terms are already accepted', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupTermsAndConditionsRoutes(page, { hasAcceptedTerms: true });
    const userAdminPage = new UserAdminPage(page);

    await userAdminPage.openUsers();

    await expect(page).toHaveURL(/\/users$/);
    await expect(userAdminPage.heading).toBeVisible();
    await expect.poll(() => routeState.userTermsStatusRequests.length).toBeGreaterThan(0);
    expect(routeState.userTermsStatusRequests).toContainEqual({
      method: 'GET',
      userId: manageOrgIntegrationUserDetails.userId
    });
    expect(routeState.acceptTermsRequests).toHaveLength(0);
  });
});
