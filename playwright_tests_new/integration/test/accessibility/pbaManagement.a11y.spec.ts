import { expect, test } from '../../fixtures';
import { setupPbaManagementRoutes } from '../../helpers';
import {
  pbaExistingAccount,
  pbaInvalidAccount,
  pbaNewAccount
} from '../../mocks/pbaManagement.mock';
import { PbaManagementPage } from '../../page-objects/pba-management.po';
import { auditAccessibilityPage, type AccessibilityEngine } from '../../../E2E/utils/accessibility/accessibilityAudit';

const accessibilityEngines: AccessibilityEngine[] = ['axe', 'wave-like', 'screen-reader'];

test.describe('PBA management accessibility', {
  tag: ['@integration', '@integration-pba-management', '@a11y']
}, () => {
  test('invalid PBA feedback and add/remove check remain accessible', async ({
    manageOrgIntegrationPage: page
  }, testInfo) => {
    const routeState = await setupPbaManagementRoutes(page);
    const pbaManagementPage = new PbaManagementPage(page);

    await pbaManagementPage.openOrganisation();
    await pbaManagementPage.openPbaManagement();
    await pbaManagementPage.addPbaNumber(pbaInvalidAccount);

    await expect(page.getByRole('textbox', { name: 'PBA Number' })).toBeVisible();
    await expect(pbaManagementPage.validationMessage('Enter a valid PBA number')).toBeVisible();
    await expect(pbaManagementPage.continueButton).toBeDisabled();
    await auditAccessibilityPage(page, testInfo, {
      defaultEngines: accessibilityEngines,
      feature: 'PBA management',
      pageState: 'invalid account feedback'
    });

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
    await auditAccessibilityPage(page, testInfo, {
      defaultEngines: accessibilityEngines,
      feature: 'PBA management',
      pageState: 'check accounts'
    });

    await changeLink.press('Enter');
    await expect(page).toHaveURL(/\/organisation\/update-pba-numbers$/);
    expect(routeState.updatePbaRequests).toHaveLength(0);
  });
});
