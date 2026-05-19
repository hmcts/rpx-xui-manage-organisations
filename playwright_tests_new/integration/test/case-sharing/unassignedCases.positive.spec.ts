import { expect, test } from '../../fixtures';
import { setupUnassignedCaseShareRoutes } from '../../helpers';
import {
  asylumCaseType,
  immigrationCaseType,
  manageOrgIntegrationOrganisationName,
  petSolicitorTwo,
  unassignedAsylumCase,
  unassignedCaseIds,
  unassignedImmigrationCase,
  unassignedSecondAsylumCase
} from '../../mocks/caseSharing.mock';
import { UnassignedCaseSharingPage } from '../../page-objects/case-sharing.po';

test.describe('Unassigned case sharing', { tag: ['@integration', '@integration-case-sharing'] }, () => {
  test('validates cancelled recipients before sharing selected unassigned cases', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupUnassignedCaseShareRoutes(page);
    const caseSharingPage = new UnassignedCaseSharingPage(page);
    const [cancelledCaseId, confirmedCaseId] = unassignedCaseIds;
    const recipientName = `${petSolicitorTwo.firstName} ${petSolicitorTwo.lastName}`;
    const recipientOptionName = `${recipientName} - ${petSolicitorTwo.email}`;

    await test.step('Load unassigned Asylum cases from mocked integration APIs', async () => {
      await caseSharingPage.gotoUnassignedCases();

      await expect(caseSharingPage.unassignedCasesHeading).toBeVisible();
      await expect(page.getByText(manageOrgIntegrationOrganisationName)).toBeVisible();
      await expect(caseSharingPage.filterButton('Show unassigned cases filter')).toBeVisible();
      await expect(caseSharingPage.filterButton('Hide unassigned cases filter')).toBeHidden();
      await expect(caseSharingPage.caseTypeTab(asylumCaseType)).toBeVisible();
      await expect(caseSharingPage.caseTypeTab(immigrationCaseType)).toBeVisible();
      await expect(caseSharingPage.shareCaseButton).toBeDisabled();
      await expect(page.getByText('Showing 1 to 2 of 2 Asylum cases', { exact: true })).toBeVisible();
      await expect(caseSharingPage.caseList).toContainText(unassignedAsylumCase.caseReference);
      await expect(caseSharingPage.caseList).toContainText(unassignedAsylumCase.caseNumber);
      await expect(caseSharingPage.caseList).toContainText(unassignedAsylumCase.claimant);
      await expect(caseSharingPage.caseList).toContainText(unassignedSecondAsylumCase.caseReference);

      await expect.poll(() => routeState.caseTypesRequests.length).toBeGreaterThan(0);
      await expect(routeState.caseTypesRequests[0]).toEqual({
        caaCasesFilterType: 'none',
        caaCasesPageType: 'unassigned-cases',
        method: 'POST'
      });
      await expect.poll(() => routeState.caseListRequests.length).toBeGreaterThan(0);
      await expect(routeState.caseListRequests[0]).toEqual({
        caaCasesFilterType: 'none',
        caaCasesPageType: 'unassigned-cases',
        caseTypeId: asylumCaseType,
        method: 'POST',
        pageNo: '1',
        pageSize: '25'
      });
    });

    await test.step('Render unassigned case data for each case-type tab', async () => {
      await caseSharingPage.openCaseTypeTab(immigrationCaseType);

      await expect(page.getByText('Showing 1 to 1 of 1 Immigration cases', { exact: true })).toBeVisible();
      await expect(caseSharingPage.caseList).toContainText(unassignedImmigrationCase.caseReference);
      await expect(caseSharingPage.caseList).toContainText(unassignedImmigrationCase.caseNumber);
      await expect(caseSharingPage.caseList).toContainText(unassignedImmigrationCase.claimant);
      await expect(caseSharingPage.caseList).not.toContainText(unassignedAsylumCase.caseReference);
      await expect(caseSharingPage.caseList).not.toContainText(unassignedSecondAsylumCase.caseReference);
      await expect.poll(() =>
        routeState.caseListRequests.some((request) =>
          request.caaCasesFilterType === 'none' &&
          request.caaCasesPageType === 'unassigned-cases' &&
          request.caseTypeId === immigrationCaseType &&
          request.method === 'POST' &&
          request.pageNo === '1' &&
          request.pageSize === '25'
        )
      ).toBe(true);

      await caseSharingPage.openCaseTypeTab(asylumCaseType);
      await expect(page.getByText('Showing 1 to 2 of 2 Asylum cases', { exact: true })).toBeVisible();
      await expect(caseSharingPage.caseList).toContainText(unassignedAsylumCase.caseReference);
      await expect(caseSharingPage.caseList).toContainText(unassignedSecondAsylumCase.caseReference);
      await expect(caseSharingPage.caseList).not.toContainText(unassignedImmigrationCase.caseReference);
    });

    await test.step('Validate the unassigned case reference filter before sharing', async () => {
      await caseSharingPage.showUnassignedCasesFilter();

      await expect(caseSharingPage.filterButton('Hide unassigned cases filter')).toBeVisible();
      await expect(caseSharingPage.filterButton('Show unassigned cases filter')).toBeHidden();

      const caseTypesRequestCount = routeState.caseTypesRequests.length;
      const caseListRequestCount = routeState.caseListRequests.length;

      await caseSharingPage.applyFilter();

      await expect(page.getByRole('alert', { name: 'There is a problem' })).toContainText(
        'Enter a valid HMCTS case reference number'
      );
      await expect(caseSharingPage.caseReferenceError).toContainText(
        'Enter a valid HMCTS case reference number'
      );
      expect(routeState.caseTypesRequests).toHaveLength(caseTypesRequestCount);
      expect(routeState.caseListRequests).toHaveLength(caseListRequestCount);

      await caseSharingPage.hideUnassignedCasesFilter();

      await expect(caseSharingPage.filterButton('Show unassigned cases filter')).toBeVisible();
      await expect(caseSharingPage.filterButton('Hide unassigned cases filter')).toBeHidden();
    });

    await test.step('Select two cases and open the share journey', async () => {
      await caseSharingPage.selectCases(unassignedCaseIds);

      await expect(caseSharingPage.shareCaseButton).toBeEnabled();
      await caseSharingPage.startCaseSharing();
      await expect(page).toHaveURL(/\/unassigned-cases\/case-share\?init=true&pageType=unassigned-cases$/);
      await expect(page.getByRole('heading', { name: /Add recipient/ })).toBeVisible();
      await expect(page.getByText('Share a case')).toBeVisible();
      await expect.poll(() => routeState.loadedShareCaseIds.length).toBe(1);
      await expect(routeState.loadedShareCaseIds[0]).toEqual(unassignedCaseIds);

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

      await expect(page.getByRole('heading', { name: 'Check and confirm your selection' })).toBeVisible();
      await expect(caseSharingPage.confirmCaseBlock(cancelledCaseId)).toContainText(recipientName);
      await expect(caseSharingPage.confirmCaseBlock(cancelledCaseId)).toContainText(petSolicitorTwo.email);
      await expect(caseSharingPage.confirmCaseBlock(cancelledCaseId)).toContainText('To be added');
      await expect(caseSharingPage.confirmCaseBlock(confirmedCaseId)).toContainText(recipientName);
      await expect(caseSharingPage.confirmCaseBlock(confirmedCaseId)).toContainText(petSolicitorTwo.email);
      await expect(caseSharingPage.confirmCaseBlock(confirmedCaseId)).toContainText('To be added');

      await caseSharingPage.confirmButton.click();

      await expect.poll(() => routeState.submittedAssignments.length).toBe(1);
      await expect(page.getByRole('heading', { name: 'Your selected cases have been updated' })).toBeVisible();
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
