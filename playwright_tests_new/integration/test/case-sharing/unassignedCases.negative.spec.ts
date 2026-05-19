import { expect, test } from '../../fixtures';
import { setupUnassignedCaseShareRoutes } from '../../helpers';
import {
  asylumCaseType,
  buildRecipientOptionName,
  petSolicitorTwo,
  unassignedAsylumCase
} from '../../mocks/caseSharing.mock';
import { CaseSharingPage } from '../../page-objects/case-sharing.po';
import { UnassignedCasesPage } from '../../page-objects/unassigned-cases.po';

test.describe('Unassigned case sharing negative paths', {
  tag: ['@integration', '@integration-case-sharing']
}, () => {
  test('blocks blank case-reference filter without requesting case data', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUnassignedCaseShareRoutes(page);
    const unassignedCasesPage = new UnassignedCasesPage(page);

    await test.step('Load unassigned cases and show the filter panel', async () => {
      await unassignedCasesPage.gotoUnassignedCases();

      await expect(unassignedCasesPage.pageHeading).toBeVisible();
      await unassignedCasesPage.showUnassignedCasesFilter();
      await expect(unassignedCasesPage.filterButton('Hide unassigned cases filter')).toBeVisible();
    });

    await test.step('Reject blank filter input before any API search is requested', async () => {
      const caseTypesRequestCount = routeState.caseTypesRequests.length;
      const caseListRequestCount = routeState.caseListRequests.length;

      await unassignedCasesPage.applyFilter();

      await expect(page.getByRole('alert', { name: 'There is a problem' })).toContainText(
        'Enter a valid HMCTS case reference number'
      );
      await expect(unassignedCasesPage.caseReferenceError).toContainText(
        'Enter a valid HMCTS case reference number'
      );
      expect(routeState.caseTypesRequests).toHaveLength(caseTypesRequestCount);
      expect(routeState.caseListRequests).toHaveLength(caseListRequestCount);
    });
  });

  test('blocks confirmation when no unassigned sharing change has been requested', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUnassignedCaseShareRoutes(page);
    const unassignedCasesPage = new UnassignedCasesPage(page);
    const caseSharingPage = new CaseSharingPage(page);
    const selectedCaseId = unassignedAsylumCase.caseReference;

    await test.step('Open case sharing for one unassigned case', async () => {
      await unassignedCasesPage.gotoUnassignedCases();

      await expect(unassignedCasesPage.pageHeading).toBeVisible();
      await expect(unassignedCasesPage.caseCheckbox(selectedCaseId)).toBeVisible();

      await unassignedCasesPage.selectCase(selectedCaseId);
      await expect(unassignedCasesPage.shareCaseButton).toBeEnabled();
      await unassignedCasesPage.startCaseSharing();

      await expect(page).toHaveURL(/\/unassigned-cases\/case-share\?init=true&pageType=unassigned-cases$/);
      await expect(page.getByRole('heading', { name: /Add recipient/ })).toBeVisible();
      await expect.poll(() => routeState.loadedShareCaseIds.length).toBe(1);
      await expect(routeState.loadedShareCaseIds[0]).toEqual([selectedCaseId]);
      expect(routeState.caseShareCaseRequests).toEqual([
        {
          caseIds: [selectedCaseId],
          method: 'GET'
        }
      ]);
    });

    await test.step('Reject continue before a recipient is added', async () => {
      await expect(caseSharingPage.caseSection(selectedCaseId)).not.toContainText(
        buildRecipientOptionName(petSolicitorTwo)
      );

      await caseSharingPage.continueButton.click();

      await expect(page.getByRole('alert', { name: 'There is a problem' })).toContainText(
        'You have not requested any changes to case sharing'
      );
      expect(routeState.submittedAssignments).toHaveLength(0);
      expect(routeState.caseAssignmentRequests).toHaveLength(0);
    });

    expect(routeState.caseListRequests).toEqual(
      expect.arrayContaining([
        {
          caaCasesFilterType: 'none',
          caaCasesFilterValue: null,
          caaCasesPageType: 'unassigned-cases',
          caseTypeId: asylumCaseType,
          method: 'POST',
          pageNo: '1',
          pageSize: '25'
        }
      ])
    );
  });
});
