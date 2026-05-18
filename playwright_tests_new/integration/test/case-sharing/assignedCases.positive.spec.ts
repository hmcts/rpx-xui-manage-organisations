import { expect, test } from '../../fixtures';
import { setupAssignedCaseRoutes } from '../../helpers';
import {
  assignedAsylumCase,
  assignedImmigrationCase,
  asylumCaseType,
  immigrationCaseType,
  manageOrgIntegrationOrganisationName
} from '../../mocks/caseSharing.mock';
import { AssignedCasesPage } from '../../page-objects/assigned-cases.po';

test.describe('Assigned cases', { tag: ['@integration', '@integration-assigned-cases'] }, () => {
  test('validates assigned case filters, tabs and case-sharing selection state', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupAssignedCaseRoutes(page);
    const assignedCasesPage = new AssignedCasesPage(page);

    await test.step('Load assigned cases from mocked integration APIs', async () => {
      await assignedCasesPage.gotoAssignedCases();

      await expect(assignedCasesPage.assignedCasesHeading).toBeVisible();
      await expect(page.getByText(manageOrgIntegrationOrganisationName)).toBeVisible();
      await expect(assignedCasesPage.filterButton('Show assigned cases filter')).toBeVisible();
      await expect(assignedCasesPage.filterButton('Hide assigned cases filter')).toBeHidden();
      await expect(assignedCasesPage.caseTypeTab(asylumCaseType)).toBeVisible();
      await expect(assignedCasesPage.caseTypeTab(immigrationCaseType)).toBeVisible();
      await expect(page.getByText('Showing 1 to 1 of 1 Asylum cases')).toBeVisible();
      await expect(assignedCasesPage.manageCaseSharingButton).toBeDisabled();

      await expect.poll(() => routeState.caseTypesRequests.length).toBeGreaterThan(0);
      await expect(routeState.caseTypesRequests[0]).toEqual({
        caaCasesFilterType: 'all-assignees',
        caaCasesPageType: 'assigned-cases',
        method: 'POST'
      });
      await expect.poll(() => routeState.caseListRequests.length).toBeGreaterThan(0);
      expect(routeState.caseListRequests[0]).toEqual({
        caaCasesFilterType: 'all-assignees',
        caaCasesPageType: 'assigned-cases',
        caseTypeId: asylumCaseType,
        method: 'POST',
        pageNo: '1',
        pageSize: '25'
      });
    });

    await test.step('Toggle assigned-cases filters using the visible controls', async () => {
      await assignedCasesPage.showAssignedCasesFilter();

      await expect(assignedCasesPage.filterButton('Hide assigned cases filter')).toBeVisible();
      await expect(assignedCasesPage.filterButton('Show assigned cases filter')).toBeHidden();

      await assignedCasesPage.hideAssignedCasesFilter();

      await expect(assignedCasesPage.filterButton('Show assigned cases filter')).toBeVisible();
      await expect(assignedCasesPage.filterButton('Hide assigned cases filter')).toBeHidden();
    });

    await test.step('Render assigned case data for each case-type tab', async () => {
      await expect(assignedCasesPage.caseList).toContainText(assignedAsylumCase.caseReference);
      await expect(assignedCasesPage.caseList).toContainText(assignedAsylumCase.caseNumber);
      await expect(assignedCasesPage.caseList).toContainText(assignedAsylumCase.claimant);

      await assignedCasesPage.openCaseTypeTab(immigrationCaseType);

      await expect(page.getByText('Showing 1 to 1 of 1 Immigration cases')).toBeVisible();
      await expect(assignedCasesPage.caseList).toContainText(assignedImmigrationCase.caseReference);
      await expect(assignedCasesPage.caseList).toContainText(assignedImmigrationCase.caseNumber);
      expect(routeState.caseListRequests).toEqual(
        expect.arrayContaining([
          {
            caaCasesFilterType: 'all-assignees',
            caaCasesPageType: 'assigned-cases',
            caseTypeId: immigrationCaseType,
            method: 'POST',
            pageNo: '1',
            pageSize: '25'
          }
        ])
      );
    });

    await test.step('Enable Manage case sharing only after selecting an assigned case', async () => {
      await assignedCasesPage.openCaseTypeTab(asylumCaseType);
      await expect(assignedCasesPage.manageCaseSharingButton).toBeDisabled();

      await assignedCasesPage.selectCase(assignedAsylumCase.caseReference);

      await expect(assignedCasesPage.manageCaseSharingButton).toBeEnabled();
    });
  });
});
