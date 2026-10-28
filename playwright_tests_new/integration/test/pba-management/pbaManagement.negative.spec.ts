import { expect, test } from '../../fixtures';
import { setupPbaManagementRoutes } from '../../helpers';
import {
  pbaExistingAccount,
  pbaFinanceUserDetails,
  pbaInvalidAccount,
  pbaNewAccount
} from '../../mocks/pbaManagement.mock';
import { PbaManagementPage } from '../../page-objects/pba-management.po';

test.describe('PBA management validation', {
  tag: ['@integration', '@integration-pba-management']
}, () => {
  test('blocks invalid PBA formats before submission', async ({ manageOrgIntegrationPage: page }) => {
    const routeState = await setupPbaManagementRoutes(page);
    const pbaManagementPage = new PbaManagementPage(page);

    await pbaManagementPage.openOrganisation();
    await pbaManagementPage.openPbaManagement();
    await pbaManagementPage.addPbaNumber(pbaInvalidAccount);

    await expect(pbaManagementPage.validationMessage('Enter a valid PBA number')).toBeVisible();
    await expect(pbaManagementPage.continueButton).toBeDisabled();
    expect(routeState.updatePbaRequests).toHaveLength(0);
  });

  test('blocks PBAs already associated with the organisation before submission', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupPbaManagementRoutes(page);
    const pbaManagementPage = new PbaManagementPage(page);

    await pbaManagementPage.openOrganisation();
    await pbaManagementPage.openPbaManagement();
    await pbaManagementPage.addPbaNumber(pbaExistingAccount);

    await expect(pbaManagementPage.validationMessage('This PBA number is already associated to your organisation')).toBeVisible();
    await expect(pbaManagementPage.continueButton).toBeDisabled();
    expect(routeState.updatePbaRequests).toHaveLength(0);
  });

  test('blocks duplicate new PBAs before submission', async ({ manageOrgIntegrationPage: page }) => {
    const routeState = await setupPbaManagementRoutes(page);
    const pbaManagementPage = new PbaManagementPage(page);

    await pbaManagementPage.openOrganisation();
    await pbaManagementPage.openPbaManagement();
    await pbaManagementPage.addPbaNumber(pbaNewAccount);
    await pbaManagementPage.addPbaNumber(pbaNewAccount, 1);

    await expect(pbaManagementPage.validationMessage('You have entered this PBA number more than once')).toBeVisible();
    await expect(pbaManagementPage.continueButton).toBeDisabled();
    expect(routeState.updatePbaRequests).toHaveLength(0);
  });

  test('hides PBA changes and rejects a direct edit route for a non-finance user', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupPbaManagementRoutes(page, {
      userDetails: {
        ...pbaFinanceUserDetails,
        roles: pbaFinanceUserDetails.roles.filter((role) => role !== 'pui-finance-manager')
      }
    });
    const pbaManagementPage = new PbaManagementPage(page);

    await pbaManagementPage.openOrganisation();

    await expect(pbaManagementPage.organisationHeading).toBeVisible();
    await expect(pbaManagementPage.organisationPbaSummary()).toContainText(pbaExistingAccount);
    await expect(pbaManagementPage.changePbaAccountsLink).toHaveCount(0);

    await page.goto('/organisation/update-pba-numbers');

    await expect(page).toHaveURL(/\/organisation$/);
    await expect(pbaManagementPage.organisationHeading).toBeVisible();
    await expect(pbaManagementPage.pbaAccountsHeading).toHaveCount(0);

    await page.goto('/organisation/update-pba-numbers-check');
    await expect(page).toHaveURL(/\/organisation$/);
    await expect(pbaManagementPage.checkPbaAccountsHeading).toHaveCount(0);
    expect(routeState.updatePbaRequests).toHaveLength(0);
  });

  test('shows service failure and keeps existing PBA after an update is rejected', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupPbaManagementRoutes(page, { updateStatus: 503 });
    const pbaManagementPage = new PbaManagementPage(page);

    await pbaManagementPage.openOrganisation();
    await pbaManagementPage.openPbaManagement();
    await pbaManagementPage.removeExistingPba(pbaExistingAccount);
    await pbaManagementPage.addPbaNumber(pbaNewAccount);
    await pbaManagementPage.continueToCheckPage();

    await expect(pbaManagementPage.checkSummaryRow('Accounts to be added')).toContainText(pbaNewAccount);
    await expect(pbaManagementPage.checkSummaryRow('Accounts to be removed')).toContainText(pbaExistingAccount);
    await pbaManagementPage.submitPbaAccounts();

    await expect.poll(() => routeState.updatePbaRequests.length).toBe(1);
    expect(routeState.updatePbaRequests[0]).toEqual({
      method: 'POST',
      pendingPaymentAccount: {
        pendingAddPaymentAccount: [pbaNewAccount],
        pendingRemovePaymentAccount: [pbaExistingAccount]
      }
    });
    await expect(page).toHaveURL(/\/service-down$/);
    await expect(page.getByRole('heading', { name: 'Sorry, there is a problem' })).toBeVisible();
    await expect(pbaManagementPage.successBanner).toHaveCount(0);

    await pbaManagementPage.openOrganisation();
    await expect(pbaManagementPage.organisationPbaSummary()).toContainText(pbaExistingAccount);
    await expect(pbaManagementPage.organisationPbaSummary()).not.toContainText(pbaNewAccount);
  });
});
