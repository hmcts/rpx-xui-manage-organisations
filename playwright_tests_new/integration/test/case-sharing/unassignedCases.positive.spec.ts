import { expect, test } from '../../fixtures';
import { setupUnassignedCaseShareRoutes } from '../../helpers';
import {
  asylumCaseType,
  buildRecipientName,
  buildRecipientOptionName,
  immigrationCaseType,
  manageOrgIntegrationOrganisationName,
  petSolicitorTwo,
  unassignedAsylumCase,
  unassignedCaseIds,
  unassignedImmigrationCase,
  unassignedSecondAsylumCase
} from '../../mocks/caseSharing.mock';
import { CaseShareCompletePage } from '../../page-objects/case-share-complete.po';
import { CaseShareConfirmPage } from '../../page-objects/case-share-confirm.po';
import { CaseSharingPage } from '../../page-objects/case-sharing.po';
import { UnassignedCasesPage } from '../../page-objects/unassigned-cases.po';

test.describe('Unassigned case sharing', { tag: ['@integration', '@integration-case-sharing'] }, () => {
  test('validates cancelled recipients before sharing selected unassigned cases', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUnassignedCaseShareRoutes(page);
    const unassignedCasesPage = new UnassignedCasesPage(page);
    const caseSharingPage = new CaseSharingPage(page);
    const confirmPage = new CaseShareConfirmPage(page);
    const completePage = new CaseShareCompletePage(page);
    const [cancelledCaseId, confirmedCaseId] = unassignedCaseIds;
    const recipientName = buildRecipientName(petSolicitorTwo);
    const recipientOptionName = buildRecipientOptionName(petSolicitorTwo);

    await test.step('Load unassigned Asylum cases from mocked integration APIs', async () => {
      await unassignedCasesPage.gotoUnassignedCases();

      await expect(unassignedCasesPage.pageHeading).toBeVisible();
      await expect(page.getByText(manageOrgIntegrationOrganisationName)).toBeVisible();
      await expect(unassignedCasesPage.filterButton('Show unassigned cases filter')).toBeVisible();
      await expect(unassignedCasesPage.filterButton('Hide unassigned cases filter')).toBeHidden();
      await expect(unassignedCasesPage.caseTypeTab(asylumCaseType)).toBeVisible();
      await expect(unassignedCasesPage.caseTypeTab(immigrationCaseType)).toBeVisible();
      await expect(unassignedCasesPage.shareCaseButton).toBeDisabled();
      await expect(page.getByText('Showing 1 to 2 of 2 Asylum cases', { exact: true })).toBeVisible();
      await expect(unassignedCasesPage.caseList).toContainText(unassignedAsylumCase.caseReference);
      await expect(unassignedCasesPage.caseList).toContainText(unassignedAsylumCase.caseNumber);
      await expect(unassignedCasesPage.caseList).toContainText(unassignedAsylumCase.claimant);
      await expect(unassignedCasesPage.caseList).toContainText(unassignedSecondAsylumCase.caseReference);

      await expect.poll(() => routeState.caseTypesRequests.length).toBeGreaterThan(0);
      await expect(routeState.caseTypesRequests[0]).toEqual({
        caaCasesFilterType: 'none',
        caaCasesFilterValue: null,
        caaCasesPageType: 'unassigned-cases',
        method: 'POST'
      });
      await expect.poll(() => routeState.caseListRequests.length).toBeGreaterThan(0);
      await expect(routeState.caseListRequests[0]).toEqual({
        caaCasesFilterType: 'none',
        caaCasesFilterValue: null,
        caaCasesPageType: 'unassigned-cases',
        caseTypeId: asylumCaseType,
        method: 'POST',
        pageNo: '1',
        pageSize: '25'
      });
    });

    await test.step('Render unassigned case data for each case-type tab', async () => {
      await unassignedCasesPage.openCaseTypeTab(immigrationCaseType);

      await expect(page.getByText('Showing 1 to 1 of 1 Immigration cases', { exact: true })).toBeVisible();
      await expect(unassignedCasesPage.caseList).toContainText(unassignedImmigrationCase.caseReference);
      await expect(unassignedCasesPage.caseList).toContainText(unassignedImmigrationCase.caseNumber);
      await expect(unassignedCasesPage.caseList).toContainText(unassignedImmigrationCase.claimant);
      await expect(unassignedCasesPage.caseList).not.toContainText(unassignedAsylumCase.caseReference);
      await expect(unassignedCasesPage.caseList).not.toContainText(unassignedSecondAsylumCase.caseReference);
      await expect.poll(() =>
        routeState.caseListRequests.some((request) =>
          request.caaCasesFilterType === 'none' &&
          request.caaCasesFilterValue === null &&
          request.caaCasesPageType === 'unassigned-cases' &&
          request.caseTypeId === immigrationCaseType &&
          request.method === 'POST' &&
          request.pageNo === '1' &&
          request.pageSize === '25'
        )
      ).toBe(true);

      await unassignedCasesPage.openCaseTypeTab(asylumCaseType);
      await expect(page.getByText('Showing 1 to 2 of 2 Asylum cases', { exact: true })).toBeVisible();
      await expect(unassignedCasesPage.caseList).toContainText(unassignedAsylumCase.caseReference);
      await expect(unassignedCasesPage.caseList).toContainText(unassignedSecondAsylumCase.caseReference);
      await expect(unassignedCasesPage.caseList).not.toContainText(unassignedImmigrationCase.caseReference);
    });

    await test.step('Validate the unassigned case reference filter before sharing', async () => {
      await unassignedCasesPage.showUnassignedCasesFilter();

      await expect(unassignedCasesPage.filterButton('Hide unassigned cases filter')).toBeVisible();
      await expect(unassignedCasesPage.filterButton('Show unassigned cases filter')).toBeHidden();

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

      await unassignedCasesPage.enterCaseReferenceFilter(unassignedAsylumCase.caseReference);
      await unassignedCasesPage.applyFilter();

      await expect.poll(() =>
        routeState.caseTypesRequests.some((request) =>
          request.caaCasesFilterType === 'case-reference-number' &&
          request.caaCasesFilterValue === unassignedAsylumCase.caseReference &&
          request.caaCasesPageType === 'unassigned-cases' &&
          request.method === 'POST'
        )
      ).toBe(true);
      await expect.poll(() =>
        routeState.caseListRequests.some((request) =>
          request.caaCasesFilterType === 'case-reference-number' &&
          request.caaCasesFilterValue === unassignedAsylumCase.caseReference &&
          request.caaCasesPageType === 'unassigned-cases' &&
          request.caseTypeId === asylumCaseType &&
          request.method === 'POST' &&
          request.pageNo === '1' &&
          request.pageSize === '25'
        )
      ).toBe(true);
      await expect(unassignedCasesPage.caseList).toContainText(unassignedAsylumCase.caseReference);
      await expect(unassignedCasesPage.caseList).not.toContainText(unassignedSecondAsylumCase.caseReference);

      await unassignedCasesPage.filterButton('Reset').click();
      await expect.poll(() =>
        routeState.caseTypesRequests.some((request) =>
          request.caaCasesFilterType === 'none' &&
          request.caaCasesFilterValue === null &&
          request.caaCasesPageType === 'unassigned-cases' &&
          request.method === 'POST'
        )
      ).toBe(true);
      await expect(unassignedCasesPage.caseList).toContainText(unassignedAsylumCase.caseReference);
      await expect(unassignedCasesPage.caseList).toContainText(unassignedSecondAsylumCase.caseReference);

      await unassignedCasesPage.hideUnassignedCasesFilter();

      await expect(unassignedCasesPage.filterButton('Show unassigned cases filter')).toBeVisible();
      await expect(unassignedCasesPage.filterButton('Hide unassigned cases filter')).toBeHidden();
    });

    await test.step('Select two cases and open the share journey', async () => {
      await unassignedCasesPage.selectCases(unassignedCaseIds);

      await expect(unassignedCasesPage.shareCaseButton).toBeEnabled();
      await unassignedCasesPage.startCaseSharing();
      await expect(page).toHaveURL(/\/unassigned-cases\/case-share\?init=true&pageType=unassigned-cases$/);
      await expect(page.getByRole('heading', { name: /Add recipient/ })).toBeVisible();
      await expect(page.getByText('Share a case')).toBeVisible();
      await expect.poll(() => routeState.loadedShareCaseIds.length).toBe(1);
      await expect(routeState.loadedShareCaseIds[0]).toEqual(unassignedCaseIds);
      expect(routeState.caseShareCaseRequests).toEqual([
        {
          caseIds: unassignedCaseIds,
          method: 'GET'
        }
      ]);
      await expect.poll(() =>
        routeState.caseShareUserRequests.length > 0 &&
        routeState.caseShareUserRequests.every((request) => request.method === 'GET')
      ).toBe(true);

      for (const caseId of unassignedCaseIds) {
        await expect(caseSharingPage.caseSection(caseId)).toContainText(caseId);
      }
    });

    await test.step('Add and then cancel one pending recipient before confirming', async () => {
      await caseSharingPage.selectRecipient('pet', recipientOptionName);
      await caseSharingPage.addRecipient();
      await caseSharingPage.showAllCaseSections();

      for (const caseId of unassignedCaseIds) {
        const selectedCase = caseSharingPage.caseSection(caseId);

        await expect(selectedCase).toContainText(recipientName);
        await expect(selectedCase).toContainText(petSolicitorTwo.email);
        await expect(selectedCase).toContainText('To be added');
      }

      await caseSharingPage.cancelPendingRecipientForCase(cancelledCaseId, recipientName);

      await expect(caseSharingPage.caseSection(cancelledCaseId)).not.toContainText(recipientName);
      await expect(caseSharingPage.caseSection(confirmedCaseId)).toContainText(recipientName);
      await expect(caseSharingPage.caseSection(confirmedCaseId)).toContainText(petSolicitorTwo.email);
    });

    await test.step('Block confirmation while a selected case has no pending recipient', async () => {
      await caseSharingPage.continueButton.click();

      await expect(page.getByRole('alert', { name: 'There is a problem' })).toContainText(
        'At least one person must be assigned to each case'
      );
      await expect(caseSharingPage.caseSection(cancelledCaseId)).not.toContainText(recipientName);
      await expect(caseSharingPage.caseSection(confirmedCaseId)).toContainText(recipientName);
    });

    await test.step('Re-add the recipient and confirm both selected case shares', async () => {
      await caseSharingPage.selectRecipient('pet', recipientOptionName);
      await caseSharingPage.addRecipient();

      await expect(caseSharingPage.caseSection(cancelledCaseId)).toContainText(recipientName);
      await expect(caseSharingPage.caseSection(cancelledCaseId)).toContainText(petSolicitorTwo.email);
      await expect(caseSharingPage.caseSection(confirmedCaseId)).toContainText(recipientName);

      await caseSharingPage.continueButton.click();

      await expect(page).toHaveURL(/\/unassigned-cases\/case-share-confirm\/unassigned-cases$/);
      await expect(confirmPage.heading).toBeVisible();
      await expect(confirmPage.confirmCaseBlock(cancelledCaseId)).toContainText(recipientName);
      await expect(confirmPage.confirmCaseBlock(cancelledCaseId)).toContainText(petSolicitorTwo.email);
      await expect(confirmPage.confirmCaseBlock(cancelledCaseId)).toContainText('To be added');
      await expect(confirmPage.confirmCaseBlock(confirmedCaseId)).toContainText(recipientName);
      await expect(confirmPage.confirmCaseBlock(confirmedCaseId)).toContainText(petSolicitorTwo.email);
      await expect(confirmPage.confirmCaseBlock(confirmedCaseId)).toContainText('To be added');

      await confirmPage.confirm();

      await expect.poll(() => routeState.submittedAssignments.length).toBe(1);
      expect(routeState.caseAssignmentRequests).toEqual([
        {
          method: 'POST',
          sharedCaseIds: unassignedCaseIds
        }
      ]);
      await expect(page).toHaveURL(/\/unassigned-cases\/case-share-complete\/unassigned-cases$/);
      await expect(completePage.heading).toBeVisible();
      await expect(completePage.whatHappensNextText(
        'If you\'ve shared one or more cases, your colleagues will now be able to access them from their case list.'
      )).toBeVisible();
    });

    const submittedAssignment = routeState.submittedAssignments[0];
    const cancelledCase = submittedAssignment.sharedCases.find((sharedCase) =>
      sharedCase.caseId === cancelledCaseId
    );
    const confirmedCase = submittedAssignment.sharedCases.find((sharedCase) =>
      sharedCase.caseId === confirmedCaseId
    );
    const cancelledResponseCase = routeState.assignmentResponses[0].find((sharedCase) =>
      sharedCase.caseId === cancelledCaseId
    );
    const confirmedResponseCase = routeState.assignmentResponses[0].find((sharedCase) =>
      sharedCase.caseId === confirmedCaseId
    );

    expect(submittedAssignment.sharedCases.map((sharedCase) => sharedCase.caseId)).toEqual(unassignedCaseIds);
    expect(cancelledCase).toBeDefined();
    expect(cancelledCase?.pendingShares ?? []).toEqual([petSolicitorTwo]);
    expect(confirmedCase).toBeDefined();
    expect(confirmedCase?.pendingShares ?? []).toEqual([petSolicitorTwo]);
    expect(confirmedCase?.pendingUnshares ?? []).toEqual([]);
    expect(cancelledResponseCase?.sharedWith).toEqual([petSolicitorTwo]);
    expect(cancelledResponseCase?.pendingShares).toEqual([]);
    expect(confirmedResponseCase?.sharedWith).toEqual([petSolicitorTwo]);
    expect(confirmedResponseCase?.pendingShares).toEqual([]);
  });
});
