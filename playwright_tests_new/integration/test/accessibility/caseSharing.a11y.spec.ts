import { AxeUtils } from '@hmcts/playwright-common';
import { expect, test } from '../../fixtures';
import {
  setupAssignedCaseShareRoutes,
  setupUnassignedCaseShareRoutes
} from '../../helpers';
import {
  assignedAsylumCase,
  assignedImmigrationCase,
  assignedSecondAsylumCase,
  buildRecipientName,
  buildRecipientOptionName,
  immigrationCaseType,
  petSolicitorOne,
  petSolicitorTwo,
  unassignedCaseIds
} from '../../mocks/caseSharing.mock';
import { AssignedCasesPage } from '../../page-objects/assigned-cases.po';
import { CaseShareCompletePage } from '../../page-objects/case-share-complete.po';
import { CaseShareConfirmPage } from '../../page-objects/case-share-confirm.po';
import { CaseSharingPage } from '../../page-objects/case-sharing.po';
import { UnassignedCasesPage } from '../../page-objects/unassigned-cases.po';

test.describe('case sharing accessibility', { tag: ['@integration', '@integration-case-sharing', '@a11y'] }, () => {
  test('unassigned case-sharing list, share, confirm and complete states have no automatically detectable accessibility violations', async ({
    manageOrgIntegrationPage: page
  }, testInfo) => {
    const routeState = await setupUnassignedCaseShareRoutes(page);
    const unassignedCasesPage = new UnassignedCasesPage(page);
    const caseSharingPage = new CaseSharingPage(page);
    const confirmPage = new CaseShareConfirmPage(page);
    const completePage = new CaseShareCompletePage(page);
    const recipientName = buildRecipientName(petSolicitorTwo);
    const recipientOptionName = buildRecipientOptionName(petSolicitorTwo);
    const axeUtils = new AxeUtils(page);

    await test.step('Audit unassigned cases list', async () => {
      await unassignedCasesPage.gotoUnassignedCases();

      await expect(unassignedCasesPage.pageHeading).toBeVisible();
      await expect(unassignedCasesPage.caseList).toBeVisible();
      await expect(unassignedCasesPage.shareCaseButton).toBeDisabled();
      await expect(page.locator('#select-all')).toHaveAccessibleName('Select all cases');
      for (const caseId of unassignedCaseIds) {
        await expect(unassignedCasesPage.caseCheckbox(caseId)).toHaveAccessibleName(`Select case ${caseId}`);
      }
      await expect.poll(() => routeState.caseListRequests.length).toBeGreaterThan(0);
      await axeUtils.audit();
      await axeUtils.generateReport(testInfo, 'unassigned cases list accessibility report');
      await testInfo.attach('unassigned cases list accessibility screenshot', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png'
      });
    });

    await test.step('Audit unassigned share page', async () => {
      const selectAllCheckbox = page.locator('#select-all');

      await selectAllCheckbox.press('Space');
      await expect(selectAllCheckbox).toBeFocused();
      await expect(selectAllCheckbox).toBeChecked();
      for (const caseId of unassignedCaseIds) {
        await expect(unassignedCasesPage.caseCheckbox(caseId)).toBeChecked();
      }
      await expect(unassignedCasesPage.shareCaseButton).toBeEnabled();

      await selectAllCheckbox.press('Space');
      await expect(selectAllCheckbox).toBeFocused();
      await expect(selectAllCheckbox).not.toBeChecked();
      for (const caseId of unassignedCaseIds) {
        await expect(unassignedCasesPage.caseCheckbox(caseId)).not.toBeChecked();
      }
      await expect(unassignedCasesPage.shareCaseButton).toBeDisabled();

      const firstCaseCheckbox = unassignedCasesPage.caseCheckbox(unassignedCaseIds[0]);

      await firstCaseCheckbox.press('Space');
      await expect(firstCaseCheckbox).toBeFocused();
      await expect(firstCaseCheckbox).toBeChecked();
      await unassignedCasesPage.selectCase(unassignedCaseIds[1]);
      await expect(unassignedCasesPage.shareCaseButton).toBeEnabled();
      await unassignedCasesPage.startCaseSharing();

      await expect(page).toHaveURL(/\/unassigned-cases\/case-share\?init=true&pageType=unassigned-cases$/);
      await expect(page.getByRole('heading', { name: /Add recipient/ })).toBeVisible();
      await expect.poll(() => routeState.loadedShareCaseIds.length).toBe(1);
      await expect(routeState.loadedShareCaseIds[0]).toEqual(unassignedCaseIds);
      await axeUtils.audit();
      await axeUtils.generateReport(testInfo, 'unassigned case-share form accessibility report');
      await testInfo.attach('unassigned case-share form accessibility screenshot', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png'
      });
    });

    await test.step('Audit unassigned share confirmation page', async () => {
      await caseSharingPage.selectRecipient('pet', recipientOptionName);
      await caseSharingPage.addRecipient();
      await caseSharingPage.continueButton.click();

      await expect(page).toHaveURL(/\/unassigned-cases\/case-share-confirm\/unassigned-cases$/);
      await expect(confirmPage.heading).toBeVisible();
      await expect(confirmPage.confirmCaseBlock(unassignedCaseIds[0])).toContainText(recipientName);
      await expect(confirmPage.confirmCaseBlock(unassignedCaseIds[1])).toContainText(recipientName);
      await axeUtils.audit();
      await axeUtils.generateReport(testInfo, 'unassigned case-share confirmation accessibility report');
      await testInfo.attach('unassigned case-share confirmation accessibility screenshot', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png'
      });
    });

    await test.step('Audit unassigned share complete page', async () => {
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
      await axeUtils.audit();
      await axeUtils.generateReport(testInfo, 'unassigned case-share complete accessibility report');
      await testInfo.attach('unassigned case-share complete accessibility screenshot', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png'
      });
    });
  });

  test('assigned case-sharing list, share, confirm and complete states have no automatically detectable accessibility violations', async ({
    manageOrgIntegrationPage: page
  }, testInfo) => {
    const routeState = await setupAssignedCaseShareRoutes(page);
    const assignedCasesPage = new AssignedCasesPage(page);
    const caseSharingPage = new CaseSharingPage(page);
    const confirmPage = new CaseShareConfirmPage(page);
    const completePage = new CaseShareCompletePage(page);
    const existingRecipientName = buildRecipientName(petSolicitorOne);
    const existingRecipientOptionName = buildRecipientOptionName(petSolicitorOne);
    const newRecipientName = buildRecipientName(petSolicitorTwo);
    const newRecipientOptionName = buildRecipientOptionName(petSolicitorTwo);
    const expectedAssignedCaseIds = [assignedImmigrationCase.caseReference];
    const axeUtils = new AxeUtils(page);

    await test.step('Audit assigned cases list', async () => {
      await assignedCasesPage.gotoAssignedCases();

      await expect(assignedCasesPage.pageHeading).toBeVisible();
      await assignedCasesPage.showAssignedCasesFilter();
      await assignedCasesPage.selectAllAssignedCasesFilter();
      await assignedCasesPage.applyFilter();

      await expect(assignedCasesPage.caseList).toBeVisible();
      await expect(assignedCasesPage.manageCaseSharingButton).toBeDisabled();
      await expect(page.locator('#select-all')).toHaveAccessibleName('Select all cases');
      for (const caseId of [assignedAsylumCase.caseReference, assignedSecondAsylumCase.caseReference]) {
        await expect(assignedCasesPage.caseCheckbox(caseId)).toHaveAccessibleName(`Select case ${caseId}`);
      }
      await expect.poll(() => routeState.caseListRequests.length).toBeGreaterThan(0);
      await axeUtils.audit();
      await axeUtils.generateReport(testInfo, 'assigned cases list accessibility report');
      await testInfo.attach('assigned cases list accessibility screenshot', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png'
      });
    });

    await test.step('Audit assigned share page', async () => {
      await assignedCasesPage.selectCase(assignedAsylumCase.caseReference);
      await expect(assignedCasesPage.caseCheckbox(assignedAsylumCase.caseReference)).toBeChecked();
      await assignedCasesPage.openCaseTypeTab(immigrationCaseType);
      await expect(assignedCasesPage.caseCheckbox(assignedImmigrationCase.caseReference)).not.toBeChecked();
      await expect(page.locator('#select-all')).toHaveAccessibleName('Select all cases');
      await expect(assignedCasesPage.caseCheckbox(assignedImmigrationCase.caseReference))
        .toHaveAccessibleName(`Select case ${assignedImmigrationCase.caseReference}`);
      await assignedCasesPage.selectCase(assignedImmigrationCase.caseReference);
      await expect(assignedCasesPage.manageCaseSharingButton).toBeEnabled();
      await assignedCasesPage.startCaseSharing();

      await expect(page).toHaveURL(/\/cases\/case-share\?init=true&pageType=assigned-cases$/);
      await expect(page.getByRole('heading', { name: 'Manage shared access to a case' })).toBeVisible();
      await expect.poll(() => routeState.loadedShareCaseIds.length).toBe(1);
      await expect(routeState.loadedShareCaseIds[0]).toEqual(expectedAssignedCaseIds);
      await axeUtils.audit();
      await axeUtils.generateReport(testInfo, 'assigned case-share form accessibility report');
      await testInfo.attach('assigned case-share form accessibility screenshot', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png'
      });
    });

    await test.step('Audit assigned share confirmation page', async () => {
      await caseSharingPage.showAllCaseSections();
      await caseSharingPage.selectRecipient('pet', newRecipientOptionName);
      await caseSharingPage.addRecipient();
      await caseSharingPage.removeRecipientFromAllCases(existingRecipientOptionName);
      await caseSharingPage.continueButton.click();

      await expect(page).toHaveURL(/\/cases\/case-share-confirm\/assigned-cases$/);
      await expect(confirmPage.heading).toBeVisible();
      for (const caseId of expectedAssignedCaseIds) {
        const confirmBlock = confirmPage.confirmCaseBlock(caseId);

        await expect(confirmBlock).toContainText(newRecipientName);
        await expect(confirmBlock).toContainText(existingRecipientName);
      }
      await axeUtils.audit();
      await axeUtils.generateReport(testInfo, 'assigned case-share confirmation accessibility report');
      await testInfo.attach('assigned case-share confirmation accessibility screenshot', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png'
      });
    });

    await test.step('Audit assigned share complete page', async () => {
      await confirmPage.confirm();

      await expect.poll(() => routeState.submittedAssignments.length).toBe(1);
      expect(routeState.caseAssignmentRequests).toEqual([
        {
          method: 'POST',
          sharedCaseIds: expectedAssignedCaseIds
        }
      ]);
      expect(routeState.submittedAssignments[0].sharedCases[0].pendingShares).toEqual([petSolicitorTwo]);
      expect(routeState.submittedAssignments[0].sharedCases[0].pendingUnshares).toEqual([petSolicitorOne]);
      await expect(page).toHaveURL(/\/cases\/case-share-complete\/assigned-cases$/);
      await expect(completePage.heading).toBeVisible();
      await axeUtils.audit();
      await axeUtils.generateReport(testInfo, 'assigned case-share complete accessibility report');
      await testInfo.attach('assigned case-share complete accessibility screenshot', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png'
      });
    });
  });
});
