import { expect, test } from '../../fixtures';
import { setupAssignedCaseShareRoutes } from '../../helpers';
import {
  assignedAsylumCase,
  buildRecipientOptionName,
  petSolicitorOne
} from '../../mocks/caseSharing.mock';
import { AssignedCasesPage } from '../../page-objects/assigned-cases.po';
import { CaseSharingPage } from '../../page-objects/case-sharing.po';

test.describe('Assigned case sharing negative paths', {
  tag: ['@integration', '@integration-assigned-cases', '@integration-case-sharing']
}, () => {
  test('blocks confirmation when no valid assigned access change exists', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupAssignedCaseShareRoutes(page);
    const assignedCasesPage = new AssignedCasesPage(page);
    const caseSharingPage = new CaseSharingPage(page);

    await test.step('Open manage case sharing for one assigned case', async () => {
      await assignedCasesPage.gotoAssignedCases();

      await expect(assignedCasesPage.pageHeading).toBeVisible();
      await expect(assignedCasesPage.caseCheckbox(assignedAsylumCase.caseReference)).toBeVisible();

      await assignedCasesPage.selectCase(assignedAsylumCase.caseReference);
      await assignedCasesPage.startCaseSharing();

      await expect(page).toHaveURL(/\/assigned-cases\/case-share\?init=true&pageType=assigned-cases$/);
      await expect(page.getByRole('heading', { name: 'Manage shared access to a case' })).toBeVisible();
      await expect.poll(() => routeState.loadedShareCaseIds.length).toBe(1);
      await expect(routeState.loadedShareCaseIds[0]).toEqual([assignedAsylumCase.caseReference]);
    });

    await test.step('Reject continue when no share or unshare change has been requested', async () => {
      await caseSharingPage.continueButton.click();

      await expect(page.getByRole('alert', { name: 'There is a problem' })).toContainText(
        'You have not requested any changes to case sharing'
      );
      expect(routeState.submittedAssignments).toHaveLength(0);
    });

    await test.step('Reject removing the only assigned person without a replacement', async () => {
      await expect(caseSharingPage.removeUserSelect).toContainText(buildRecipientOptionName(petSolicitorOne));

      await caseSharingPage.removeRecipientFromAllCases(buildRecipientOptionName(petSolicitorOne));

      await expect(caseSharingPage.caseSection(assignedAsylumCase.caseReference)).toContainText('To be removed');

      await caseSharingPage.continueButton.click();

      await expect(page.getByRole('alert', { name: 'There is a problem' })).toContainText(
        'At least one person must be assigned to each case'
      );
      expect(routeState.submittedAssignments).toHaveLength(0);
    });
  });
});
