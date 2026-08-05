import { expect, test } from '../../fixtures';
import { setupPbaManagementRoutes } from '../../helpers';
import {
  pbaExistingAccount,
  pbaNewAccount
} from '../../mocks/pbaManagement.mock';
import { PbaManagementPage } from '../../page-objects/pba-management.po';

test.describe('PBA management', { tag: ['@integration', '@integration-pba-management'] }, () => {
  test('adds and removes PBA accounts through the finance-user journey', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupPbaManagementRoutes(page);
    const pbaManagementPage = new PbaManagementPage(page);

    await test.step('Open organisation details with existing finance-user PBA access', async () => {
      await pbaManagementPage.openOrganisation();

      await expect(pbaManagementPage.organisationHeading).toBeVisible();
      await expect(pbaManagementPage.organisationPbaSummary()).toContainText(pbaExistingAccount);
      await expect(pbaManagementPage.changePbaAccountsLink).toBeVisible();
      await expect.poll(() => routeState.organisationRequests.length).toBeGreaterThan(0);
      expect(routeState.organisationRequests.every((method) => method === 'GET')).toBe(true);
    });

    await test.step('Remove and cancel removal before making the final PBA changes', async () => {
      await pbaManagementPage.openPbaManagement();

      await expect(pbaManagementPage.pbaAccountsHeading).toBeVisible();
      await expect(page.getByText(pbaExistingAccount, { exact: true })).toBeVisible();

      await pbaManagementPage.removeExistingPba(pbaExistingAccount);
      await expect(page.getByRole('columnheader', { name: 'To be removed' })).toBeVisible();
      await expect(page.getByText(pbaExistingAccount, { exact: true })).toBeVisible();

      await pbaManagementPage.cancelPendingPbaRemoval(pbaExistingAccount);
      await expect(page.getByRole('columnheader', { name: 'To be removed' })).toHaveCount(0);
      await expect(page.getByText(pbaExistingAccount, { exact: true })).toBeVisible();
    });

    await test.step('Submit the deterministic add/remove payload and verify success state', async () => {
      await pbaManagementPage.removeExistingPba(pbaExistingAccount);
      await pbaManagementPage.addPbaNumber(pbaNewAccount);
      await pbaManagementPage.continueToCheckPage();

      await expect(pbaManagementPage.checkPbaAccountsHeading).toBeVisible();
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
      await expect(page).toHaveURL(/\/organisation$/);
      await expect(pbaManagementPage.successBanner).toContainText(
        'PBA numbers submitted. We\'ll email you once they\'re approved.'
      );
      await expect(pbaManagementPage.organisationPbaSummary()).toContainText(`${pbaNewAccount} (Pending approval)`);
      await expect(pbaManagementPage.organisationPbaSummary()).not.toContainText(pbaExistingAccount);
    });
  });
});
