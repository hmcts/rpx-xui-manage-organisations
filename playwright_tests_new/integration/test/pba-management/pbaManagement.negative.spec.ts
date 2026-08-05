import { expect, test } from '../../fixtures';
import { setupPbaManagementRoutes } from '../../helpers';
import {
  pbaExistingAccount,
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
});
