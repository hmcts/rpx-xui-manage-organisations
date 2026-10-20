import { expect, test } from '../../fixtures';
import {
  setupOrganisationDetailsRoutes,
  setupRegisterOrganisationRoutes,
  setupUnassignedCaseListRoutes
} from '../../helpers';
import { unassignedAsylumCase } from '../../mocks/caseSharing.mock';
import { manageOrgIntegrationOrganisationName } from '../../mocks/manageOrgIntegration.mock';
import { AssignedCasesPage } from '../../page-objects/assigned-cases.po';
import { OrganisationPage } from '../../page-objects/organisation.po';
import { RegisterOrganisationPage } from '../../page-objects/register-organisation.po';

test.use({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 1,
  locale: 'en-GB',
  colorScheme: 'light',
  reducedMotion: 'reduce'
});

test.describe('SRT organisation visual baseline', { tag: ['@integration', '@srt-visual'] }, () => {
  test.skip(process.env.RUN_SRT_VISUAL !== '1', 'Visual comparison is an explicit, non-release-gating review run');

  test('shows mocked organisation details', async ({ manageOrgIntegrationPage: page }) => {
    await setupOrganisationDetailsRoutes(page);
    const organisationPage = new OrganisationPage(page);

    await organisationPage.open();
    await expect(organisationPage.heading).toBeVisible();
    await expect(organisationPage.summaryValue('Name')).toContainText(manageOrgIntegrationOrganisationName);
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot('organisation-details.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide'
    });
  });

  test('shows mocked case navigation and table', async ({ manageOrgIntegrationPage: page }) => {
    await setupUnassignedCaseListRoutes(page);
    const casesPage = new AssignedCasesPage(page);

    await page.goto('/');
    await page.getByRole('link', { name: 'Cases', exact: true }).click();
    await expect(casesPage.pageHeading).toBeVisible();
    await expect(casesPage.caseList).toContainText(unassignedAsylumCase.caseReference);
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot('case-list.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide'
    });
  });

  test('shows mocked registration start form', async ({ manageOrgIntegrationPage: page }) => {
    await setupRegisterOrganisationRoutes(page);
    const registrationPage = new RegisterOrganisationPage(page);

    await registrationPage.openStartPage();
    await expect(registrationPage.startPageHeading).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot('registration-start.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide'
    });
  });

  test('shows mocked organisation type form', async ({ manageOrgIntegrationPage: page }) => {
    await setupRegisterOrganisationRoutes(page);
    const registrationPage = new RegisterOrganisationPage(page);

    await registrationPage.openStartPage();
    await registrationPage.startRegistration();
    await expect(page.getByRole('heading', { name: 'What type of organisation are you registering?' })).toBeVisible();
    await expect(registrationPage.otherOrganisationTypeRadio).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot('organisation-type-form.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide'
    });
  });
});
