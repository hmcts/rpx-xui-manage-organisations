import { AxeUtils } from '@hmcts/playwright-common';
import { expect, test } from '../../fixtures';
import { setupPbaManagementRoutes } from '../../helpers';
import {
  pbaExistingAccount,
  pbaInvalidAccount,
  pbaNewAccount
} from '../../mocks/pbaManagement.mock';
import { PbaManagementPage } from '../../page-objects/pba-management.po';

test.describe('PBA management accessibility', {
  tag: ['@integration', '@integration-pba-management', '@a11y']
}, () => {
  test('invalid PBA feedback and add/remove check remain accessible', async ({
    manageOrgIntegrationPage: page
  }, testInfo) => {
    const routeState = await setupPbaManagementRoutes(page);
    const pbaManagementPage = new PbaManagementPage(page);
    const axeUtils = new AxeUtils(page);

    await pbaManagementPage.openOrganisation();
    await pbaManagementPage.openPbaManagement();
    await pbaManagementPage.addPbaNumber(pbaInvalidAccount);

    await expect(page.getByRole('textbox', { name: 'PBA Number' })).toBeVisible();
    await expect(pbaManagementPage.validationMessage('Enter a valid PBA number')).toBeVisible();
    await expect(pbaManagementPage.continueButton).toBeDisabled();
    await axeUtils.audit();

    await pbaManagementPage.pbaInput(0).fill(pbaNewAccount);
    await pbaManagementPage.pbaInput(0).blur();
    await pbaManagementPage.removeExistingPba(pbaExistingAccount);
    await pbaManagementPage.continueToCheckPage();

    await expect(pbaManagementPage.checkPbaAccountsHeading).toBeVisible();
    await expect(pbaManagementPage.checkSummaryRow('Accounts to be added')).toContainText(pbaNewAccount);
    await expect(pbaManagementPage.checkSummaryRow('Accounts to be removed')).toContainText(pbaExistingAccount);
    await expect(page.getByText(/You won't be able to use removed PBA accounts, unless they are verified again\./)).toBeVisible();
    const changeLink = pbaManagementPage.checkSummaryRow('Accounts to be added')
      .getByRole('link', { name: 'Change PBA account numbers' });
    await expect(changeLink).toBeVisible();
    await axeUtils.audit();
    await axeUtils.generateReport(testInfo, 'PBA validation and check accessibility report');

    await changeLink.press('Enter');
    await expect(page).toHaveURL(/\/organisation\/update-pba-numbers$/);
    expect(routeState.updatePbaRequests).toHaveLength(0);
  });
});
