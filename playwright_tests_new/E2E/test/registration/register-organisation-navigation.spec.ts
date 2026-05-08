import type { Page } from '@playwright/test';
import { test, expect } from '../../fixtures';
import { createRegisterOrganisationData } from '../../utils/test-setup/register-organisation-data';
import { completeOptionalRegisterOrganisationJourney } from '../../utils/test-setup/register-organisation-journeys';

test.use({ manageOrgUserRole: 'roo' });

const expectRegisterOrganisationScreen = async (page: Page, screenText: string): Promise<void> => {
  await expect(page.getByText(screenText, { exact: true }).first()).toBeVisible();
};

test.describe('Register organisation navigation', () => {
  test(
    'navigates backwards through the optional register-org-new journey',
    { tag: ['@e2e', '@registration', '@navigation'] },
    async ({ signedInPage, registerOrganisationPage }) => {
      const data = createRegisterOrganisationData();
      await completeOptionalRegisterOrganisationJourney(registerOrganisationPage, data);
      await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

      for (const expectedScreen of [
        'What regulator are you (as an individual) registered with?',
        'Are you (as an individual) registered with a regulator?',
        'Provide your contact details',
        'What PBA numbers does your organisation use?',
        'Does your organisation have a payment by account number?',
        'Which services will your organisation need to access?',
        'Who is your organisation registered with?',
        'What\'s the DX reference for this office?',
        'Do you have a document exchange reference for your main office?',
        'Is this a UK address?',
        'What is the registered address of your organisation?',
        'What is your organisation name and Companies House number?',
        'What type of organisation are you registering?',
        'Apply for an organisation to manage civil, family and tribunal cases'
      ]) {
        await registerOrganisationPage.goBackInWorkflow();
        await expectRegisterOrganisationScreen(signedInPage, expectedScreen);
      }
    }
  );

  test(
    'opens each check-your-answers change link on the expected register-org-new screen',
    { tag: ['@e2e', '@registration', '@navigation'] },
    async ({ signedInPage, registerOrganisationPage }) => {
      const data = createRegisterOrganisationData();
      await completeOptionalRegisterOrganisationJourney(registerOrganisationPage, data);
      await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

      for (const { summaryLabel, expectedScreen } of [
        {
          summaryLabel: 'Organisation type',
          expectedScreen: 'What type of organisation are you registering?'
        },
        {
          summaryLabel: 'Organisation name',
          expectedScreen: 'What is your organisation name and Companies House number?'
        },
        {
          summaryLabel: 'Company registration number',
          expectedScreen: 'What is your organisation name and Companies House number?'
        },
        {
          summaryLabel: 'Organisation address',
          expectedScreen: 'Is this a UK address?'
        },
        {
          summaryLabel: 'What\'s the DX reference for this office?',
          expectedScreen: 'What\'s the DX reference for this office?'
        },
        {
          summaryLabel: 'Service to access',
          expectedScreen: 'Which services will your organisation need to access?'
        },
        {
          summaryLabel: 'Does your organisation have a payment by account number?',
          expectedScreen: 'Does your organisation have a payment by account number?'
        },
        {
          summaryLabel: 'Regulatory organisation type',
          expectedScreen: 'Who is your organisation registered with?'
        },
        {
          summaryLabel: 'First name(s)',
          expectedScreen: 'Provide your contact details'
        },
        {
          summaryLabel: 'Last name',
          expectedScreen: 'Provide your contact details'
        },
        {
          summaryLabel: 'Email address',
          expectedScreen: 'Provide your contact details'
        },
        {
          summaryLabel: 'What regulators are you (as an individual) registered with?',
          expectedScreen: 'What regulator are you (as an individual) registered with?'
        }
      ]) {
        await registerOrganisationPage.openSummaryChangeLink(summaryLabel);
        await expectRegisterOrganisationScreen(signedInPage, expectedScreen);
        await registerOrganisationPage.openWorkflowPage('check-your-answers');
        await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
      }
    }
  );

  test(
    'continues from an organisation-type change link back to check your answers',
    { tag: ['@e2e', '@registration', '@navigation'] },
    async ({ signedInPage, registerOrganisationPage }) => {
      const data = createRegisterOrganisationData();
      await completeOptionalRegisterOrganisationJourney(registerOrganisationPage, data);
      await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

      await registerOrganisationPage.openSummaryChangeLink('Organisation type');
      await expectRegisterOrganisationScreen(signedInPage, 'What type of organisation are you registering?');

      await registerOrganisationPage.continueWith();
      await expectRegisterOrganisationScreen(signedInPage, 'What is your organisation name and Companies House number?');

      await registerOrganisationPage.continueWith();
      await expectRegisterOrganisationScreen(signedInPage, 'What is the registered address of your organisation?');

      await registerOrganisationPage.enterManualUkAddress(data.manualUkAddress);
      await expectRegisterOrganisationScreen(signedInPage, 'Do you have a document exchange reference for your main office?');

      for (const expectedScreen of [
        'What\'s the DX reference for this office?',
        'Who is your organisation registered with?',
        'Which services will your organisation need to access?',
        'Does your organisation have a payment by account number?',
        'What PBA numbers does your organisation use?',
        'Provide your contact details',
        'Are you (as an individual) registered with a regulator?',
        'What regulator are you (as an individual) registered with?',
        'Check your answers before you register'
      ]) {
        await registerOrganisationPage.continueWith();
        await expectRegisterOrganisationScreen(signedInPage, expectedScreen);
      }
    }
  );
});
