import { expect, test } from '../../fixtures';
import { setupAssignedCaseShareRoutes } from '../../helpers';
import {
  assignedAsylumCase,
  assignedCaseIds,
  assignedImmigrationCase,
  assignedSecondAsylumCase,
  asylumCaseType,
  immigrationCaseType,
  manageOrgIntegrationOrganisationName,
  petSolicitorOne,
  petSolicitorTwo,
  buildRecipientName,
  buildRecipientOptionName
} from '../../mocks/caseSharing.mock';
import { AssignedCasesPage } from '../../page-objects/assigned-cases.po';
import { CaseShareCompletePage } from '../../page-objects/case-share-complete.po';
import { CaseShareConfirmPage } from '../../page-objects/case-share-confirm.po';
import { CaseSharingPage } from '../../page-objects/case-sharing.po';

test.describe('Assigned cases', { tag: ['@integration', '@integration-assigned-cases', '@integration-case-sharing'] }, () => {
  test('validates assigned case filters, tabs and manage-sharing submission', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupAssignedCaseShareRoutes(page);
    const assignedCasesPage = new AssignedCasesPage(page);
    const caseSharingPage = new CaseSharingPage(page);
    const confirmPage = new CaseShareConfirmPage(page);
    const completePage = new CaseShareCompletePage(page);
    const existingRecipientName = buildRecipientName(petSolicitorOne);
    const newRecipientName = buildRecipientName(petSolicitorTwo);
    const newRecipientOptionName = buildRecipientOptionName(petSolicitorTwo);
    const existingRecipientOptionName = buildRecipientOptionName(petSolicitorOne);

    await test.step('Load assigned cases from mocked integration APIs', async () => {
      await assignedCasesPage.gotoAssignedCases();

      await expect(assignedCasesPage.pageHeading).toBeVisible();
      await expect(page.getByText(manageOrgIntegrationOrganisationName)).toBeVisible();
      await expect(assignedCasesPage.filterButton('Show assigned cases filter')).toBeVisible();
      await expect(assignedCasesPage.filterButton('Hide assigned cases filter')).toBeHidden();
      await expect(assignedCasesPage.caseTypeTab(asylumCaseType)).toBeVisible();
      await expect(assignedCasesPage.caseTypeTab(immigrationCaseType)).toBeVisible();
      await expect(page.getByText('Showing 1 to 2 of 2 Asylum cases', { exact: true })).toBeVisible();
      await expect(assignedCasesPage.manageCaseSharingButton).toBeDisabled();

      await expect.poll(() => routeState.caseTypesRequests.length).toBeGreaterThan(0);
      await expect(routeState.caseTypesRequests[0]).toEqual({
        caaCasesFilterType: 'all-assignees',
        caaCasesFilterValue: null,
        caaCasesPageType: 'assigned-cases',
        method: 'POST'
      });
      await expect.poll(() => routeState.caseListRequests.length).toBeGreaterThan(0);
      expect(routeState.caseListRequests[0]).toEqual({
        caaCasesFilterType: 'all-assignees',
        caaCasesFilterValue: null,
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

      await assignedCasesPage.selectCaseReferenceFilter();
      await assignedCasesPage.enterCaseReferenceFilter(assignedAsylumCase.caseReference);
      await assignedCasesPage.applyFilter();

      await expect.poll(() =>
        routeState.caseTypesRequests.some((request) =>
          request.caaCasesFilterType === 'case-reference-number' &&
          request.caaCasesFilterValue === assignedAsylumCase.caseReference &&
          request.caaCasesPageType === 'assigned-cases' &&
          request.method === 'POST'
        )
      ).toBe(true);
      await expect.poll(() =>
        routeState.caseListRequests.some((request) =>
          request.caaCasesFilterType === 'case-reference-number' &&
          request.caaCasesFilterValue === assignedAsylumCase.caseReference &&
          request.caaCasesPageType === 'assigned-cases' &&
          request.caseTypeId === asylumCaseType &&
          request.method === 'POST' &&
          request.pageNo === '1' &&
          request.pageSize === '25'
        )
      ).toBe(true);
      await expect(assignedCasesPage.caseList).toContainText(assignedAsylumCase.caseReference);
      await expect(assignedCasesPage.caseList).not.toContainText(assignedSecondAsylumCase.caseReference);
      await expect(assignedCasesPage.caseList).not.toContainText(assignedImmigrationCase.caseReference);

      await assignedCasesPage.filterRadio('all-assignees').check();
      await assignedCasesPage.applyFilter();
      await expect.poll(() =>
        routeState.caseTypesRequests.some((request) =>
          request.caaCasesFilterType === 'all-assignees' &&
          request.caaCasesFilterValue === null &&
          request.caaCasesPageType === 'assigned-cases' &&
          request.method === 'POST'
        )
      ).toBe(true);
      await expect(assignedCasesPage.caseList).toContainText(assignedAsylumCase.caseReference);
      await expect(assignedCasesPage.caseList).toContainText(assignedSecondAsylumCase.caseReference);
      await expect(assignedCasesPage.caseList).toContainText(assignedAsylumCase.caseNumber);

      await assignedCasesPage.hideAssignedCasesFilter();

      await expect(assignedCasesPage.filterButton('Show assigned cases filter')).toBeVisible();
      await expect(assignedCasesPage.filterButton('Hide assigned cases filter')).toBeHidden();
    });

    await test.step('Render assigned case data for each case-type tab', async () => {
      await expect(assignedCasesPage.caseList).toContainText(assignedAsylumCase.caseReference);
      await expect(assignedCasesPage.caseList).toContainText(assignedAsylumCase.caseNumber);
      await expect(assignedCasesPage.caseList).toContainText(assignedAsylumCase.claimant);
      await expect(assignedCasesPage.caseList).toContainText(assignedSecondAsylumCase.caseReference);
      await expect(assignedCasesPage.caseList).not.toContainText(assignedImmigrationCase.caseReference);

      await assignedCasesPage.openCaseTypeTab(immigrationCaseType);

      await expect(page.getByText('Showing 1 to 1 of 1 Immigration cases', { exact: true })).toBeVisible();
      await expect(assignedCasesPage.caseList).toContainText(assignedImmigrationCase.caseReference);
      await expect(assignedCasesPage.caseList).toContainText(assignedImmigrationCase.caseNumber);
      await expect(assignedCasesPage.caseList).not.toContainText(assignedAsylumCase.caseReference);
      await expect(assignedCasesPage.caseList).not.toContainText(assignedSecondAsylumCase.caseReference);
      expect(routeState.caseListRequests).toEqual(
        expect.arrayContaining([
          {
            caaCasesFilterType: 'all-assignees',
            caaCasesFilterValue: null,
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

    await test.step('Select assigned cases across tabs and open manage-sharing', async () => {
      await assignedCasesPage.openCaseTypeTab(immigrationCaseType);
      await assignedCasesPage.selectCase(assignedImmigrationCase.caseReference);

      await assignedCasesPage.startCaseSharing();

      await expect(page).toHaveURL(/\/assigned-cases\/case-share\?init=true&pageType=assigned-cases$/);
      await expect(page.getByRole('heading', { name: 'Manage shared access to a case' })).toBeVisible();
      await expect(page.getByText('Manage case sharing')).toBeVisible();
      await expect.poll(() => routeState.loadedShareCaseIds.length).toBe(1);
      await expect(routeState.loadedShareCaseIds[0]).toEqual(assignedCaseIds);
    });

    await test.step('Add a new recipient and remove existing access for selected assigned cases', async () => {
      await caseSharingPage.showAllCaseSections();

      for (const caseId of assignedCaseIds) {
        const selectedCase = caseSharingPage.caseSection(caseId);

        await expect(selectedCase).toContainText(existingRecipientName);
        await expect(selectedCase).toContainText(petSolicitorOne.email);
      }

      await caseSharingPage.selectRecipient('pet', newRecipientOptionName);
      await caseSharingPage.addRecipient();
      await caseSharingPage.removeRecipientFromAllCases(existingRecipientOptionName);

      for (const caseId of assignedCaseIds) {
        const selectedCase = caseSharingPage.caseSection(caseId);

        await expect(selectedCase).toContainText(newRecipientName);
        await expect(selectedCase).toContainText(petSolicitorTwo.email);
        await expect(selectedCase).toContainText('To be added');
        await expect(selectedCase).toContainText(existingRecipientName);
        await expect(selectedCase).toContainText(petSolicitorOne.email);
        await expect(selectedCase).toContainText('To be removed');
      }
    });

    await test.step('Confirm assigned case-sharing changes and submit the expected payload', async () => {
      await caseSharingPage.continueButton.click();

      await expect(page).toHaveURL(/\/assigned-cases\/case-share-confirm\/assigned-cases$/);
      await expect(confirmPage.heading).toBeVisible();

      for (const caseId of assignedCaseIds) {
        const confirmBlock = confirmPage.confirmCaseBlock(caseId);

        await expect(confirmBlock).toContainText(newRecipientName);
        await expect(confirmBlock).toContainText(petSolicitorTwo.email);
        await expect(confirmBlock).toContainText('To be added');
        await expect(confirmBlock).toContainText(existingRecipientName);
        await expect(confirmBlock).toContainText(petSolicitorOne.email);
        await expect(confirmBlock).toContainText('To be removed');
      }

      await confirmPage.confirm();

      await expect.poll(() => routeState.submittedAssignments.length).toBe(1);
      await expect(page).toHaveURL(/\/assigned-cases\/case-share-complete\/assigned-cases$/);
      await expect(completePage.heading).toBeVisible();
      await expect(completePage.whatHappensNextText(
        'The people you added can now access and update the selected cases from their case list.'
      )).toBeVisible();
      await expect(completePage.whatHappensNextText(
        'If you removed someone from a case, they cannot access the case anymore.'
      )).toBeVisible();
    });

    const submittedAssignment = routeState.submittedAssignments[0];
    const responseAssignment = routeState.assignmentResponses[0];

    expect(submittedAssignment.sharedCases.map((sharedCase) => sharedCase.caseId)).toEqual(assignedCaseIds);

    for (const caseId of assignedCaseIds) {
      const submittedCase = submittedAssignment.sharedCases.find((sharedCase) =>
        sharedCase.caseId === caseId
      );
      const responseCase = responseAssignment.find((sharedCase) => sharedCase.caseId === caseId);

      expect(submittedCase?.pendingShares).toEqual([petSolicitorTwo]);
      expect(submittedCase?.pendingUnshares).toEqual([petSolicitorOne]);
      expect(responseCase?.sharedWith).toEqual([petSolicitorTwo]);
      expect(responseCase?.pendingShares).toEqual([]);
      expect(responseCase?.pendingUnshares).toEqual([]);
    }
  });

  test('keeps assigned pending-share cancellation scoped to the selected case', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupAssignedCaseShareRoutes(page);
    const assignedCasesPage = new AssignedCasesPage(page);
    const caseSharingPage = new CaseSharingPage(page);
    const confirmPage = new CaseShareConfirmPage(page);
    const completePage = new CaseShareCompletePage(page);
    const [cancelledCaseId, confirmedCaseId] = assignedCaseIds;
    const recipientName = buildRecipientName(petSolicitorTwo);
    const recipientOptionName = buildRecipientOptionName(petSolicitorTwo);

    await test.step('Open assigned case sharing for two selected cases', async () => {
      await assignedCasesPage.gotoAssignedCases();

      await expect(assignedCasesPage.pageHeading).toBeVisible();

      await assignedCasesPage.selectCase(cancelledCaseId);
      await assignedCasesPage.openCaseTypeTab(immigrationCaseType);
      await assignedCasesPage.selectCase(confirmedCaseId);
      await assignedCasesPage.startCaseSharing();

      await expect(page).toHaveURL(/\/assigned-cases\/case-share\?init=true&pageType=assigned-cases$/);
      await expect(page.getByRole('heading', { name: 'Manage shared access to a case' })).toBeVisible();
      await expect.poll(() => routeState.loadedShareCaseIds.length).toBe(1);
      await expect(routeState.loadedShareCaseIds[0]).toEqual(assignedCaseIds);
    });

    await test.step('Cancel the pending new recipient for one selected assigned case', async () => {
      await caseSharingPage.selectRecipient('pet', recipientOptionName);
      await caseSharingPage.addRecipient();
      await caseSharingPage.showAllCaseSections();

      for (const caseId of assignedCaseIds) {
        const selectedCase = caseSharingPage.caseSection(caseId);

        await expect(selectedCase).toContainText(recipientName);
        await expect(selectedCase).toContainText(petSolicitorTwo.email);
        await expect(selectedCase).toContainText('To be added');
      }

      await caseSharingPage.cancelPendingRecipientForCase(cancelledCaseId, recipientName);

      await expect(caseSharingPage.caseSection(cancelledCaseId)).not.toContainText(recipientName);
      await expect(caseSharingPage.caseSection(cancelledCaseId)).not.toContainText(petSolicitorTwo.email);
      await expect(caseSharingPage.caseSection(confirmedCaseId)).toContainText(recipientName);
      await expect(caseSharingPage.caseSection(confirmedCaseId)).toContainText(petSolicitorTwo.email);
      await expect(caseSharingPage.caseSection(confirmedCaseId)).toContainText('To be added');
    });

    await test.step('Show only the remaining changed assigned case on check and confirm', async () => {
      await caseSharingPage.continueButton.click();

      await expect(page).toHaveURL(/\/assigned-cases\/case-share-confirm\/assigned-cases$/);
      await expect(confirmPage.heading).toBeVisible();
      await expect(confirmPage.confirmCaseBlock(cancelledCaseId)).toHaveCount(0);
      await expect(confirmPage.confirmCaseBlock(confirmedCaseId)).toContainText(recipientName);
      await expect(confirmPage.confirmCaseBlock(confirmedCaseId)).toContainText(petSolicitorTwo.email);
      await expect(confirmPage.confirmCaseBlock(confirmedCaseId)).toContainText('To be added');

      await confirmPage.confirm();

      await expect.poll(() => routeState.submittedAssignments.length).toBe(1);
      await expect(page).toHaveURL(/\/assigned-cases\/case-share-complete\/assigned-cases$/);
      await expect(completePage.heading).toBeVisible();
    });

    const submittedAssignment = routeState.submittedAssignments[0];
    const cancelledCase = submittedAssignment.sharedCases.find((sharedCase) =>
      sharedCase.caseId === cancelledCaseId
    );
    const confirmedCase = submittedAssignment.sharedCases.find((sharedCase) =>
      sharedCase.caseId === confirmedCaseId
    );

    expect(submittedAssignment.sharedCases.map((sharedCase) => sharedCase.caseId)).toEqual(assignedCaseIds);
    expect(cancelledCase?.pendingShares).toEqual([]);
    expect(cancelledCase?.pendingUnshares).toEqual([]);
    expect(confirmedCase?.pendingShares).toEqual([petSolicitorTwo]);
    expect(confirmedCase?.pendingUnshares).toEqual([]);
  });
});
